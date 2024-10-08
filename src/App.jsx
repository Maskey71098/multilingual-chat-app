import Chat from "./component/Chat/chat";
import List from "./component/List/list";
import Detail from "./component/Detail/Detail";
import { onAuthStateChanged, onnAuthStateChanged } from "firebase/auth";
import { auth } from "./lib.firebase";
import {useUserStore } from "./lib/userStore";
import { useEffect } from "react";

import { Login } from "./components/login/login";
import { Signup } from "./components/signup/signup";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();


  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) =>{
      fetchUserInfo(user?.uid);
    });
    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  console.log(currentUser)

  if (isLoading) return <div className="loading">Loading...</div>
  return (
    <main className="body-wrapper">
      <div className="auth-container">
        <section className="login-section">
          <Login />
        </section>
        <section className="signup-section">
          <Signup />
        </section>
      </div>
    </main>
  );
};

export default App;

    <div className='container'>
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {chatId && <Detail />}
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
    );
  };
    
export default App;