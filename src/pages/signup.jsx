import "../style/Signup.css";
import API from "../api";
import { useState } from "react";

export default function signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await API.post("/signup", {
        username,
        email,
        password,
      });

      setMessage(res.data.message);

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage("Signup failed");
      console.error(error);
    }
  };

  return (
    <div className="signup-page">
      <div className="bg-circle circle1"></div>
      <div className="bg-circle circle2"></div>

      <div className="signup-container">
        {/* Left Side */}
        <div className="signup-left">
          <h1>Create Account 🚀</h1>

          <p>
            Join the premium modern chat platform with secure authentication and
            responsive experience.
          </p>

          <div className="feature-list">
            <div>
              <span></span>
              Real-time Messaging
            </div>

            <div>
              <span></span>
              Secure Authentication
            </div>

            <div>
              <span></span>
              Modern Responsive UI
            </div>

            <p className="login-link">
              Already have an account?
              <a href="/login"> Login</a>
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="signup-right">
          <div className="logo-section"></div>

          <div className="signup-heading">
            <h2>Sign Up</h2>
            <p>Create your account to continue</p>
          </div>

          {message && (
            <div className="success-box">
              {message}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div className="input-box">
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-box">
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />
            </div>

            <button className="signup-btn" type="submit">
              Create Account
            </button>
          </form>

          <div className="divider">
            <span></span>
            <p>OR</p>
            <span></span>
          </div>

          <div className="social-login">
            <button type="button">
              Continue with Google
            </button>

            <button type="button">
              Continue with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}