"""
AWS Lambda handler for DELETE document.
Fixes CORS preflight (OPTIONS) so browser requests from localhost/frontend succeed.
Deploy this as your Lambda Function URL handler.
"""
import os
import json
from supabase import create_client, Client

supabase: Client = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_KEY"),
)

CORS_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Max-Age": "86400",
}


def _get_http_method(event):
    """Get HTTP method for both API Gateway and Lambda Function URL (payload 1.0 and 2.0)."""
    if not event:
        return None
    # Lambda Function URL (payload 2.0)
    ctx = event.get("requestContext") or {}
    http = ctx.get("http") or {}
    method = http.get("method")
    if method:
        return method
    # API Gateway / payload 1.0
    method = event.get("httpMethod")
    if method:
        return method
    return ctx.get("httpMethod")


def _response(status, message, cors_headers=None):
    headers = (cors_headers or CORS_HEADERS).copy()
    return {
        "statusCode": status,
        "headers": headers,
        "body": json.dumps({"error": message}),
    }


def lambda_handler(event, context):
    # Ensure every response has CORS headers (including errors)
    try:
        method = _get_http_method(event)
        method = (method or "").upper()

        # --- CORS preflight: must return 200 with CORS headers before any other logic ---
        if method == "OPTIONS":
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": "",
            }

        headers = event.get("headers") or {}
        if isinstance(headers, dict):
            auth_header = headers.get("Authorization") or headers.get("authorization") or ""
        else:
            auth_header = ""

        if not auth_header.startswith("Bearer "):
            return _response(401, "Missing or invalid Authorization header")

        token = auth_header.split(" ")[1]

        user_res = supabase.auth.get_user(token)
        user = user_res.user

        if not user:
            return _response(401, "Invalid Session")

        user_id = user.id

        # Extract document id (support both rawPath and path)
        path = event.get("rawPath") or event.get("path") or ""
        parts = path.rstrip("/").split("/")
        doc_id = parts[-1] if parts else ""

        if not doc_id:
            return _response(400, "Missing document ID")

        result = (
            supabase.table("documents")
            .update({"status": "DELETED"})
            .eq("id", doc_id)
            .eq("user_id", user_id)
            .neq("status", "PROCESSING")
            .execute()
        )

        if not result.data:
            return _response(
                404,
                "Document not found, unauthorized, or currently being processed.",
            )

        return {
            "statusCode": 204,
            "headers": CORS_HEADERS,
            "body": "",
        }

    except Exception as e:
        print("ERROR:", str(e))
        return _response(500, "Internal Server Error")
