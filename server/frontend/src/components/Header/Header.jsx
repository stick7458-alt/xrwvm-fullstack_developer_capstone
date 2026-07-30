import React, { useState, useEffect } from "react";

const Header = () => {
  const [username, setUsername] = useState(sessionStorage.getItem("username") || "");

  useEffect(() => {
    setUsername(sessionStorage.getItem("username") || "");
  }, []);

  const logout = async () => {
    await fetch(`/djangoapp/logout`, { method: "GET" });
    sessionStorage.removeItem("username");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <a className="brand" href="/">Best Cars Dealership</a>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about/">About Us</a></li>
        <li><a href="/contact/">Contact Us</a></li>
        {username ? (
          <>
            <li>Welcome, {username}</li>
            <li><a href="#" onClick={logout}>Logout</a></li>
          </>
        ) : (
          <>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
