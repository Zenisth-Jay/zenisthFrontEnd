# CORS fix for Delete Document Lambda

## What was wrong

The browser sends a **preflight `OPTIONS`** request before the actual `DELETE`. Your Lambda must:

1. **Recognize the HTTP method** for your Lambda URL (event shape can be different from API Gateway).
2. **Return 200 with CORS headers for `OPTIONS`** before doing any auth or logic.

If the method was not detected (e.g. `method` was `None`), the code skipped the OPTIONS branch and returned 401 (no auth on preflight). That 401 might not have been returned with CORS in all cases, or the Lambda URL might have returned a non-CORS response for OPTIONS.

## What was changed in `delete_document_lambda.py`

- **`_get_http_method(event)`** – Reads `method` from both Lambda Function URL formats (`requestContext.http.method` and `httpMethod`) so `OPTIONS` is always detected.
- **OPTIONS handled first** – As soon as the method is `OPTIONS`, return `200` with `CORS_HEADERS` and empty body.
- **`Access-Control-Max-Age: 86400`** – So the browser can cache the preflight for 24 hours.
- **`rawPath` and `path`** – Document ID is taken from either field so it works with Lambda URL and API Gateway.

## Deploy

1. Replace your current Lambda handler code with the contents of `delete_document_lambda.py`.
2. Deploy the Lambda and test from your frontend (e.g. `http://localhost:5173`).

## If CORS still fails

- **Lambda Function URL**: In the AWS Console, open your Lambda → Configuration → Function URL. Ensure “Configure cross-origin resource sharing (CORS)” is not overriding your Lambda response, or disable it so the Lambda’s own headers are used.
- **API Gateway**: If you use API Gateway instead of Function URL, enable “OPTIONS” on the same resource and pass the request to this Lambda so OPTIONS returns 200 with the same CORS headers.
