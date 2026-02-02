import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginContext from "../contexts/loginContext";

function Home() {
  const { currentUser, userLogin, loading } = useContext(LoginContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Redirect logged-in user based on role
  useEffect(() => {
    if (!loading && currentUser?.isLoggedIn && currentUser?.roleData) {
      navigate(`/${currentUser?.roleData}`, { replace: true });
    }
  }, [currentUser, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setErrorMessage("");

    const success = await userLogin(email, password);
    if (!success) setErrorMessage("Invalid email or password.");

    setLoginLoading(false);
  };

  if (loading)
    return <p className="text-center mt-20">Checking authentication...</p>;

  return (
    <div className="h-screen flex justify-center items-center bg-[#fbf8f2]">
      <div className="flex flex-col justify-center items-center w-full max-w-md p-6">
        <h1 className="text-5xl font-bold tracking-[-3px] text-center">
          Think, Plan, Execute
        </h1>
        <p className="text-xl mt-4 font-light text-gray-700 text-center">
          Manage your projects efficiently
        </p>

        <form
          className="mt-8 flex flex-col w-full gap-4"
          onSubmit={handleLogin}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loginLoading}
            className="px-4 py-2 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loginLoading ? "Logging in..." : "Login"}
          </button>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Home;
