import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
// import { fetchTokens } from "./redux/features/tokenSlice";

const App = () => {
  return (
    <div>
      <AppRoutes />
    </div>
  );
};

export default App;
