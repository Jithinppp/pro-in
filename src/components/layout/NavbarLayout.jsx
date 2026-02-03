import React, { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import { Outlet } from "react-router-dom";
import Loader from "../common/Loader";

function NavbarLayout() {
  const { currentUser, logout, loading } = useContext(AuthContext);
  console.log(currentUser, loading);

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <nav className="flex justify-between items-center mt-20">
        <div className="flex flex-col">
          <h1 className="text-5xl font-bold tracking-[-3px]">Hi there,</h1>
          <p className="font-thin text-2xl tracking-normal">
            {currentUser?.user?.email}
          </p>
        </div>
        <button
          onClick={logout}
          className="cursor-pointer rounded-md hover:text-gray-600 transition-colors duration-200"
        >
          Logout
        </button>
      </nav>
      <Outlet />
    </>
  );
}

export default NavbarLayout;
