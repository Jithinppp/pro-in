// src/components/layout/NavbarLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "../../contexts/AuthContext";

function ProtectedLayout() {
  // protected route logic here
  const { currentUser, loading } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser?.isLoggedIn) {
      navigate("/");
    }
  }, [loading, currentUser, navigate]);
  return (
    <>
      <Outlet />
    </>
  );
}

export default ProtectedLayout;
