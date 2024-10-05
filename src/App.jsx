import { Login } from "./components/login/login";
import { Signup } from "./components/signup/signup";
import Chat from "./component/Chat/chat";
import List from "./component/List/list";
import Detail from "./component/Detail/Detail";
import { useUserStore } from "./lib/userStore";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
//import UserList from "./components/userList/userList";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>;
  return (
    <>
      {currentUser ? (
        <main className="chat-container">
          <div className="container">
            <List />
            <Chat />
            <Detail />
          </div>
        </main>
      ) : (
        <main className="body-wrapper">
          <div className="auth-container">
            <section className="login-section">
              <Login />
            </section>
            <section className="signup-section">
              <Signup />
            </section>
            {/* <section>      
          <UserList/>
        </section> */}
          </div>
        </main>
      )}
    </>
  );
};

export default App;
