import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";


const LoginForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "", // ✅ Changed from 'username' to 'email'
    password: "",
    conpassword: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ Correct navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.conpassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("https://devionxwebsitebackend.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error);
      } else {
        alert("Signup successful!");
        navigate("/login"); // ✅ Redirect to login after signup
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again!");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email" // ✅ Changed from 'text' to 'email'
          name="email"
          placeholder="Email" // ✅ Changed from 'Username' to 'Email'
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="conpassword"
          placeholder="Confirm Password"
          value={formData.conpassword}
          onChange={handleChange}
          required
        />

        <button className="mybut" type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default LoginForm;
