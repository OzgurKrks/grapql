import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "./apollo/client";
import store from "./store";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Header />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </Provider>
    </ApolloProvider>
  );
}

export default App;
