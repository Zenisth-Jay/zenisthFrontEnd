import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import UploadOverlay from "./components/ui/UploadOverlay";
// import { fetchTokens } from "./redux/features/tokenSlice";

const App = () => {
  return (
    <div>
      <AppRoutes />
      <UploadOverlay />
    </div>
  );
};

export default App;
