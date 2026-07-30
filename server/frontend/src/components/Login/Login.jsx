import React, { useState } from "react";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    const res = await fetch(`/djangoapp/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, password }),
    });
    const json = await res.json();
    if (json.status === "Authenticated") {
      sessionStorage.setItem("username", json.userName);
      window.location.href = "/";
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="register-container">
      <h1>Login</h1>
      <form className="register-form" onSubmit={login}>
        <label htmlFor="userName">Username</label>
        <input
          id="userName"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="register-error">{error}</p>}
        <button type="submit" className="register-btn">Login</button>
      </form>
    </div>
  );
};

export default Login;
