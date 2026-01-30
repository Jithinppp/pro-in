import { useContext, useEffect, useState } from "react";
import LoginContext from "../contexts/loginContext";
import { useNavigate } from "react-router-dom";
import { logout, roles } from "../utils/supabase";

function Home() {
  // states and contexts
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser, userLogin } = useContext(LoginContext);

  // others
  const navigate = useNavigate();

  // effects
  useEffect(() => {
    if (currentUser.isLoggedIn) {
      navigate(`/${roles[currentUser.roleData]}`);
    }
    // console.log(currentUser);
  }, [currentUser, navigate]);

  // handlers
  const handleLogin = (e) => {
    e.preventDefault();
    userLogin(email, password);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-[#fbf8f2]">
      <div className="flex justify-center items-center flex-col">
        <h1 className="text-5xl font-bold tracking-[-3px] text-center">
          Think, plan, execute
        </h1>
        <p className="text-xl mt-4 font-light text-gray-700">
          manage your projects efficiently
        </p>
        <form
          className="mt-8 flex space-x-4 flex-col justify-center items-center p-2 gap-4 "
          onSubmit={handleLogin}
        >
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="px-4 w-full mx-0 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="px-4 w-full   mx-0 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button className=" px-4 py-2 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
            Submit
          </button>
          <button onClick={logout}>logout</button>
        </form>
      </div>
    </div>
  );
}

export default Home;
{
  /* <div>
      <h1>Welcome home</h1>
      <Link to={"project-manager"}>Project manager</Link>
      <br />
      <Link to={"technicians"}>Technician</Link>
      <br />
      <Link to={"inventory"}>Inventory</Link>
    </div> */
}
