import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPass from "../pages/ForgotPass";
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
import IdpDoc from "../pages/menuPages/operationMenu/IdpDoc";
import UserProfile from "../pages/user/UserProfile";
import SelectTag from "../pages/translation/SelectTag";
import Translating from "../pages/translation/Translating";
import CreateTag from "../pages/translation/CreateTag";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPass />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Operation Menu */}
      {/* <Route path="/operations/translate" element={<TranslateDoc />} /> */}
      <Route
        path="/operations/:toolType/translate-history"
        element={<TranslateHistory />}
      />
      <Route path="/operations/tags-library" element={<TagLibrary />} />

      {/* Resources Menu */}
      <Route path="/resources/api-keys" element={<ApiKeys />} />
      <Route path="/resources/api-reference" element={<ApiReferences />} />
      <Route path="/resources/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/resources/terms" element={<TermsAndService />} />

      {/* Learn Menu */}
      <Route path="/learn/plateform-overview" element={<PlatformOverview />} />
      <Route path="/learn/video-tutorial" element={<VideoTutorial />} />
      <Route path="/learn/user-guides" element={<UserGuides />} />
      <Route path="/learn/developer-docs" element={<DeveloperDocs />} />

      {/* Support Menu */}
      <Route path="/support/help" element={<Help />} />
      <Route path="/support/contact-support" element={<ContactSupport />} />

      {/* Admin Menu */}
      <Route path="/admin/security-center" element={<SecurityCenter />} />
      <Route path="/admin/access-control" element={<AccessControl />} />

      {/* User Profile */}
      <Route path="/user-profile" element={<UserProfile />} />

      {/* Translation Routes */}
      {/* <Route path="/operations/translate/select-tag" element={<SelectTag />} /> */}
      <Route
        path="/operations/:toolType/translating"
        element={<Translating />}
      />
      <Route path="/operations/:toolType/create-tag" element={<CreateTag />} />

      {/* IDP */}
      {/* <Route path="/operations/idp" element={<TranslateDoc />} /> */}
      <Route path="/operations/:toolType" element={<TranslateDoc />} />
      <Route path="/operations/:toolType/select-tag" element={<SelectTag />} />
      <Route
        path="/operations/:toolType/extracting"
        element={<Translating />}
      />

      {/* 404 */}
      <Route path="*" element={<h1>404 - Page not found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
