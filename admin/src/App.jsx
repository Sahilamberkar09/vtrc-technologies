import { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./features/auth/Login";
import SignUp from "./features/auth/SignUp";
import Dashboard from "./features/admin/Dashboard";
import { userDataContext } from "./context/UserContext";

function App() {
  const { isAuthenticated, loadingAuth } = useContext(userDataContext);

  if (loadingAuth) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-bg text-text">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-t-2 border-accent animate-spin"></div>
          <span className="text-sm font-medium text-muted">
            Authenticating...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <SignUp />}
        />
      </Routes>
    </>
  );
}

export default App;
