import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoginContext from "../../contexts/loginContext";

function Equipment() {
  const { currentUser, loading, logout } = useContext(LoginContext);
  let params = useParams();
  const navigate = useNavigate();
  // Protect route
  useEffect(() => {
    if (!loading && !currentUser?.isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [currentUser, loading, navigate]);
  console.log(params);
  return (
    <div>
      <h1>Equipment</h1>
    </div>
  );
}

export default Equipment;
