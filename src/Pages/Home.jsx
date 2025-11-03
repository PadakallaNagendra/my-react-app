import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleBackToMenu = () => {
    navigate("/menu");
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h2 className="text-3xl font-semibold mb-2">Welcome to Home Page</h2>
      <p className="text-gray-600 mb-6">
        This is a simple React + Router setup.
      </p>

      <button
        onClick={handleBackToMenu}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-200"
      >
        🔙 Back to Dashboard
      </button>
    </div>
  );
};

export default HomePage;
