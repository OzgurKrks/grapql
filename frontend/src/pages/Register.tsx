import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { register } from "../store/authSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const validateForm = (): boolean => {
    let valid = true;

    // Name validation
    if (!name.trim()) {
      setNameError("Name is required");
      valid = false;
    } else {
      setNameError("");
    }

    // Email validation
    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      valid = false;
    } else {
      setEmailError("");
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    } else {
      setPasswordError("");
    }

    // Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      valid = false;
    } else {
      setConfirmPasswordError("");
    }

    return valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const resultAction = await dispatch(register({ name, email, password }));
      if (register.fulfilled.match(resultAction)) {
        navigate("/");
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Register
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                nameError
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && (
              <p className="mt-1 text-red-500 text-sm">{nameError}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                emailError
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && (
              <p className="mt-1 text-red-500 text-sm">{emailError}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                passwordError
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <p className="mt-1 text-red-500 text-sm">{passwordError}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                confirmPasswordError
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPasswordError && (
              <p className="mt-1 text-red-500 text-sm">
                {confirmPasswordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
