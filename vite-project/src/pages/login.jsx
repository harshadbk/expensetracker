import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { Link } from "react-router-dom";

const LoginForm = () => {
    
    const [formData, setFormData] = useState({
        email: "", // ✅ Changed 'username' to 'email'
        password: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("https://devionxwebsitebackend.onrender.com/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username",formData.email);
                alert("Login successful!");
                navigate("/profile");
            } else {
                setError(data.errors);
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Try again!");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>

                {error && <p className="error">{error}</p>}

                <input
                    type="email" // ✅ Changed from 'text' to 'email'
                    name="email" // ✅ Changed from 'username' to 'email'
                    placeholder="Email"
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

                <p className="forgot-password">Forgot Password?</p>
                <button className="mybut" type="submit">Login</button>
                <p className="forgot-password">
                    Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;
