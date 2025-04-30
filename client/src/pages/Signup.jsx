import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {logo, bgimage} from "../assets/image/index";
import GoogleSignInButton from "../components/GoogleSignInButton";


export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(["user"]); // Added role field
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setMessage("Please enter a valid email address.");
            return;
        }
             setMessage("Signing you up...");
             
        const formData = { name, email, password, role };
    
        try {
            const res = await axios.post(
                "https://eventhon.onrender.com/api/auth/register",
                formData,
                { withCredentials: true }
            );
    
            setMessage("Signup successful! Redirecting to OTP...");
            setTimeout(() => {
                navigate("/otp-verfy", { state: { email } });
            }, 2000);
        } catch (error) {
            if (error.response?.status === 409) {
                setMessage("User already exists. Redirecting to login...");
                setTimeout(() => navigate("/"), 2000);
            } else {
                setMessage(error.response?.data?.message || "Signup failed. Try again.");
            }
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
                    <h2 style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Join Us!</h2>
                </div>
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
                    }}>Sign Up</h3>
                    {message && <p style={{ color: "red", fontWeight: "bold" }}>{message}</p>}
                    <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ padding: "12px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem" }}
                        />
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

                        {/* Role toggle checkbox */}
                        <label style={{ fontSize: "0.9rem", textAlign: "left" }}>
                            <input
                                type="checkbox"
                                checked={role.includes("Organizer")}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setRole(["Organizer", "user"]);
                                    } else {
                                        setRole(["user"]);
                                    }
                                }}
                            />{" "}
                            Check if you want to host events on our platform
                        </label>

                        <button type="submit" style={{
                            padding: "12px",
                            borderRadius: "5px",
                            backgroundImage: "linear-gradient(62deg, #8EC5FC 0%, #e0c3fc 100%)",
                            color: "white",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "1rem",
                            transition: "0.3s"
                        }}>
                            Sign Up
                        </button>
                    </form>
                    <p style={{ marginTop: "10px", fontSize: "0.9rem" }}>
                        Already have an account?{" "}
                        <span style={{ color: "#007BFF", cursor: "pointer", fontWeight: "bold" }} onClick={() => navigate("/login")}>
                            Login
                        </span>
                    </p>

                    <GoogleSignInButton/>
                </div>
            </div>
        </div>
    );
}
