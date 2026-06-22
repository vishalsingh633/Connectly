import "../style/Login.css";
import API from "../api";
import { useState } from "react";

export default function PremiumLoginPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");

const handleLogin = async (e) => {
e.preventDefault();


try {
  const res = await API.post("/login", {
    username: "temp",
    email,
    password,
  });

  setMessage(res.data.message);

  if (res.data.success) {
  localStorage.setItem("email", email);

  console.log(
    "Saved Email:",
    localStorage.getItem("email")
  );

  window.location.href = "/chat";
}
} catch (err) {
  setMessage("Login failed");
  console.error(err);
}


};

return ( <div className="login-page"> <div className="background-shape shape1"></div> <div className="background-shape shape2"></div>


  <div className="login-container">
    <div className="login-left">
      <h1>Welcome Back 👋</h1>

      <p>
        Modern premium login page with responsive layout and
        interactive design.
      </p>

      <div className="features">
        <div>
          <span></span>
          Secure Authentication
        </div>

        <div>
          <span></span>
          Fully Responsive
        </div>

        <div>
          <span></span>
          Modern UI Experience
        </div>
      </div>
    </div>

    <div className="login-right">
      <div className="logo-box">
        <div className="logo">V</div>

        <div>
          <h2>Chat</h2>
          <p>Premium Experience</p>
        </div>
      </div>

      <div className="heading">
        <h2>Login</h2>
        <p>Enter your credentials to continue</p>
      </div>

      {message && (
        <div className="success-box">
          {message}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />
        </div>

        <div className="input-group">
          <div className="password-top">
            <label>Password</label>

            <button type="button">
              Forgot Password?
            </button>
          </div>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />
        </div>

        <div className="remember-box">
          <label>
            <input type="checkbox" />
            Remember me
          </label>

          <span>Secure Login</span>
        </div>

        <button
          type="submit"
          className="login-btn"
        >
          Sign In
        </button>
      </form>

      <div className="divider">
        <span></span>
        <p>OR</p>
        <span></span>
      </div>

      <div className="social-buttons">
        <button type="button">
          Continue with Google
        </button>

        <button type="button">
          Continue with GitHub
        </button>
      </div>

      <p className="signup-text">
        Don’t have an account?
        <a href="/sign"> Create Account</a>
      </p>
    </div>
  </div>
</div>

);
}
