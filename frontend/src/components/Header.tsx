import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/authSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">GraphQL App</h1>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition duration-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition duration-200"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm transition duration-200"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
