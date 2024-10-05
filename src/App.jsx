import { Login } from "./components/login/login";
import { Signup } from "./components/signup/signup";
import Chat from "./component/Chat/chat";
import List from "./component/List/list";
import Detail from "./component/Detail/Detail";
//import UserList from "./components/userList/userList";

const App = () => {
  return (
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
        {/* <div className="container">
          <List />
          <Chat />
          <Detail />
        </div> */}
      </div>
    </main>
  );
};

export default App;
