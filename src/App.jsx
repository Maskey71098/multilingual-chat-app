import { Login } from "./components/login/login";
import { Signup } from "./components/signup/signup";

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
      </div>
    </main>
  );
};

export default App;
