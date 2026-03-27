import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = ({
  size = 20,
  pathToNavigate,
  className = "",
  label = "",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (pathToNavigate) {
      navigate(pathToNavigate);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center px-3 py-3 h-fit rounded-lg hover:bg-gray-100 transition ${className}`}
    >
      <ArrowLeft size={size} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default BackButton;
