import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute"; // Import the Gatekeeper

// Auth Pages
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPass from "../pages/ForgotPass";
import ChangePassword from "../pages/ChangePassword";

// Protected Pages
import Dashboard from "../pages/main/Dashboard";
import TranslateDoc from "../pages/menuPages/operationMenu/TranslateDoc";
import TranslateHistory from "../pages/menuPages/operationMenu/TranslateHistory";
import TagLibrary from "../pages/menuPages/operationMenu/TagLibrary";
import ApiKeys from "../pages/menuPages/resourcesMenu/ApiKeys";
import ApiReferences from "../pages/menuPages/resourcesMenu/ApiReferences";
import PrivacyPolicy from "../pages/menuPages/resourcesMenu/PrivacyPolicy";
import TermsAndService from "../pages/menuPages/resourcesMenu/TermsAndService";
import PlatformOverview from "../pages/menuPages/learnMenu/PlatformOverview";
import VideoTutorial from "../pages/menuPages/learnMenu/VideoTutorial";
import UserGuides from "../pages/menuPages/learnMenu/UserGuides";
import DeveloperDocs from "../pages/menuPages/learnMenu/DeveloperDocs";
import Help from "../pages/menuPages/supportMenu/Help";
import ContactSupport from "../pages/menuPages/supportMenu/ContactSupport";
import SecurityCenter from "../pages/menuPages/AdminMenu/SecurityCenter";
import AccessControl from "../pages/menuPages/AdminMenu/AccessControl";
import UserProfile from "../pages/user/UserProfile";
import SelectTag from "../pages/translation/SelectTag";
import Translating from "../pages/translation/Translating";
import CreateTag from "../pages/translation/CreateTag";
import CreditManage from "../pages/main/CreditManage";
import ViewTag from "../pages/translation/ViewTag";
import DocumentHistory from "../pages/menuPages/operationMenu/DocumentHistory";
import DocumentPreview from "../pages/menuPages/operationMenu/DocumentPreview";
import FileStatus from "../pages/translation/FileStatus";

const AppRoutes = () => {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPass />} />
      <Route path="/change-password" element={<ChangePassword />} />
      {/* <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      /> */}

      {/* --- Protected Routes (Wrapped in ProtectedRoute) --- */}

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Operation Menu */}

      {/* <Route path="/operations/translate" element={<TranslateDoc />} /> */}
      <Route
        path="/operations/:toolType/history"
        element={
          <ProtectedRoute>
            <TranslateHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operations/:toolType/tags-library"
        element={
          <ProtectedRoute>
            <TagLibrary />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/document-history"
        element={
          <ProtectedRoute>
            <DocumentHistory />
          </ProtectedRoute>
        }
      />

      {/* Resources Menu */}
      <Route
        path="/resources/api-keys"
        element={
          <ProtectedRoute>
            <ApiKeys />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources/api-reference"
        element={
          <ProtectedRoute>
            <ApiReferences />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources/privacy-policy"
        element={
          <ProtectedRoute>
            <PrivacyPolicy />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources/terms"
        element={
          <ProtectedRoute>
            <TermsAndService />
          </ProtectedRoute>
        }
      />

      {/* Learn Menu */}
      <Route
        path="/learn/plateform-overview"
        element={
          <ProtectedRoute>
            <PlatformOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn/video-tutorial"
        element={
          <ProtectedRoute>
            <VideoTutorial />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn/user-guides"
        element={
          <ProtectedRoute>
            <UserGuides />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn/developer-docs"
        element={
          <ProtectedRoute>
            <DeveloperDocs />
          </ProtectedRoute>
        }
      />

      {/* Support Menu */}
      <Route
        path="/support/help"
        element={
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support/contact-support"
        element={
          <ProtectedRoute>
            <ContactSupport />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/:toolType/translate-history"
        element={
          <ProtectedRoute>
            <TranslateHistory />
          </ProtectedRoute>
        }
      />

      {/* TAG Edit and VIew */}
      <Route
        path="operations/:toolType/tag/:tagAction/:tagId"
        element={
          <ProtectedRoute>
            <ViewTag />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/tags-library"
        element={
          <ProtectedRoute>
            <TagLibrary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operations/:toolType"
        element={
          <ProtectedRoute>
            <TranslateDoc />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/:toolType/preview"
        element={
          <ProtectedRoute>
            <DocumentPreview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations/:toolType/select-tag"
        element={
          <ProtectedRoute>
            <SelectTag />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operations/:toolType/translating"
        element={
          <ProtectedRoute>
            <Translating />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operations/:toolType/extracting"
        element={
          <ProtectedRoute>
            <Translating />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operations/:toolType/file-status"
        element={
          <ProtectedRoute>
            <FileStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operations/:toolType/create-tag"
        element={
          <ProtectedRoute>
            <CreateTag />
          </ProtectedRoute>
        }
      />

      {/* Admin Menu */}
      <Route
        path="/admin/security-center"
        element={
          <ProtectedRoute>
            <SecurityCenter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/access-control"
        element={
          <ProtectedRoute>
            <AccessControl />
          </ProtectedRoute>
        }
      />

      {/* User Profile */}
      <Route
        path="/user-profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />

      {/* Resources & Learn (Usually protected if they contain sensitive IP) */}
      <Route
        path="/resources/api-keys"
        element={
          <ProtectedRoute>
            <ApiKeys />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources/api-reference"
        element={
          <ProtectedRoute>
            <ApiReferences />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn/plateform-overview"
        element={
          <ProtectedRoute>
            <PlatformOverview />
          </ProtectedRoute>
        }
      />

      {/* Static/Info Pages (Can stay public or be protected) */}
      <Route
        path="/resources/privacy-policy"
        element={
          <ProtectedRoute>
            <PrivacyPolicy />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources/terms"
        element={
          <ProtectedRoute>
            <TermsAndService />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support/help"
        element={
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support/contact-support"
        element={
          <ProtectedRoute>
            <ContactSupport />
          </ProtectedRoute>
        }
      />

      {/* Credit Management */}
      <Route
        path="/credit-manage"
        element={
          <ProtectedRoute>
            <CreditManage />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<h1>404 - Page not found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
