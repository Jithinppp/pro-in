import { createContext, useEffect, useState } from "react";
import supabase from "../utils/supabase";

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const initialLoginState = {
    isLoggedIn: false,
    user: null,
  };

  // use states here
  const [currentUser, setCurrentUser] = useState(initialLoginState);
  // use effects here
  useEffect(() => {
    console.log("hello from login context");
  }, []);

  // login
  const login = async (email, password) => {
    // perform login logic here
    // update state accordingly
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      console.log("Login error:", error.message);
      return;
    }
    console.log("Login successful:", data);
    setCurrentUser({ isLoggedIn: true, user: data.user });
  };

  return (
    <LoginContext.Provider value={{ login, initialLoginState, currentUser }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
