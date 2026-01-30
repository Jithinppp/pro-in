import { createContext, useEffect, useState } from "react";
import { checkRole, checkSession, login } from "../utils/supabase";

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  // initial login states
  const [currentUser, setCurrentUser] = useState({
    isLoggedIn: false,
    user: null,
    roleData: null,
  });
  // check session on mount
  useEffect(() => {
    const fetchSessionAndRoleData = async () => {
      // 1 check server session
      const session = await checkSession();
      // console.log(session);
      // 2 if session exists, get role data
      if (session) {
        const { data } = await checkRole(session.user.email);
        // 3 set current user state
        setCurrentUser({
          isLoggedIn: true,
          user: session.user,
          roleData: data.user_role,
        });
      }
    };
    fetchSessionAndRoleData();
  }, []);

  // login function
  const userLogin = async (email, password) => {
    try {
      // 1 login user
      const user = await login(email, password);
      // 2 get role data
      if (user) {
        const { data } = await checkRole(user.email);
        if (data) {
          console.log("role data fetched");
          // 3 set current user state
          setCurrentUser({
            isLoggedIn: true,
            user: user,
            roleData: data.role,
          });
        }
      }
    } catch (error) {
      console.log("Login error:", error.message);
    }
  };

  return (
    <LoginContext.Provider value={{ currentUser, userLogin }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;

// const checkSession = async () => {
//       const { data, error } = await supabase.auth.getSession();
//       if (error) {
//         console.log("Error fetching session:", error.message);
//         return;
//       }
//       if (data.session) {
//         const roleData = await checkRole(data.session.user.email);
//         setCurrentUser({
//           isLoggedIn: true,
//           user: data.session.user,
//         });
//       }
//     };
//     checkSession();

// // login
// const login = async (email, password) => {
//   try {
//     // authenticate user
//     const { data } = await supabase.auth.signInWithPassword({
//       email: email,
//       password: password,
//     });
//     // then get the user role
//     const roleData = await checkRole(data.user.email);
//     setCurrentUser({
//       isLoggedIn: true,
//       user: data.user,
//       roleData: roleData.role,
//     });
//   } catch (error) {
//     console.log("Login error:", error.message);
//   }
// };
