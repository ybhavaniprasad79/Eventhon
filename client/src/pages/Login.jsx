import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {logo, bgimage} from "../assets/image/index";
import GoogleSignInButton from "../components/GoogleSignInButton";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setMessage("Please enter a valid email address.");
            return;
        }

        setMessage("Logining you in...");
        const loginData = { email, password };

        try {
            const response = await axios.post("https://eventhon.onrender.com/api/auth/login", loginData);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                setMessage("Login successful! Redirecting...");
                setTimeout(() => navigate("/"), 2000);
            } else {
                setMessage("Invalid email or password.");
            }
        } catch (error) {
            console.error("Login error: ", error);
            setMessage("Login failed. Please check your credentials.");
        }
    };

    return (
        <div style={{
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            height: "100vh", 
            width: "100vw", 
            backgroundImage: `url(${bgimage})`,
            backgroundSize: "100% 100%", 
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center"
        }}>
            <div style={{
                display: "flex", 
                width: "800px", 
                backgroundColor: "white", 
                borderRadius: "10px", 
                boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
                overflow: "hidden"
            }}>
                {/* Left Half - Gradient Background */}
                <div style={{
                    width: "50%", 
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    padding: "30px", 
                    backgroundImage: "linear-gradient(62deg, #8EC5FC 0%, #e0c3fc 100%)"
                }}>
                    <img src={logo} alt="Logo" style={{ width: "100px", height: "100px", borderRadius: "50%", marginBottom: "20px" }} />
                    <h2 style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Welcome Back!</h2>
                </div>
                {/* Right Half - Form Fields */}
                <div style={{
                    width: "50%", 
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "center", 
                    padding: "30px", 
                    textAlign: "center",
                    backgroundColor: "#f4f4f4"
                }}>
                    <h3 style={{ 
                        fontFamily: "Nunito", 
                        fontWeight: "bold", 
                        fontSize: "1.8rem", 
                        backgroundImage: "linear-gradient(62deg, #8EC5FC 0%, #e0c3fc 100%)", 
                        WebkitBackgroundClip: "text", 
                        color: "transparent"
                    }}>Log in</h3>
                    {message && <p style={{ color: message.includes("successful") ? "green" : "red", fontWeight: "bold" }}>{message}</p>}
                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <input
                            type="email"
                            placeholder="Email ID"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ padding: "12px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem" }}
                        />
                        <input
                            type="password"
                            placeholder="Enter Your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ padding: "12px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem" }}
                        />
                        <button type="submit" style={{
                            padding: "12px", 
                            borderRadius: "5px", 
                            backgroundImage: "linear-gradient(62deg, #8EC5FC 0%, #e0c3fc 100%)", 
                            color: "white", 
                            fontWeight: "bold", 
                            cursor: "pointer",
                            fontSize: "1rem",
                            transition: "0.3s"
                        }}
                        onMouseOver={(e) => e.target.style.opacity = "0.8"}
                        onMouseOut={(e) => e.target.style.opacity = "1"}
                        >
                            Login
                        </button>
                    </form>
                    <p style={{ marginTop: "10px", fontSize: "0.9rem" }}>
                        Don’t have an account? <span style={{ color: "#007BFF", cursor: "pointer", fontWeight: "bold" }} onClick={() => navigate("/signup")}>
                            Sign up
                        </span>
                    </p>


                    <GoogleSignInButton/>
                </div>
            </div>
        </div>
    );
}