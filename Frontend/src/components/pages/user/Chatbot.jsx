import { useState } from "react";
import { sendChat } from "../../../services/ChatService";
import { useNavigate } from "react-router-dom";
import {
    FaRobot,
    FaPaperPlane,
    FaTimes,
    FaComments
} from "react-icons/fa";

export default function Chatbot() {

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "👋 Hi, I am Civora Assistant. How can I help you?"
        }
    ]);

    const navigate = useNavigate();

    const sendMessage = async () => {
        if (!message.trim()) return;

        const userMessage = {
            sender: "user",
            text: message
        };

        setMessages((prev) => [...prev, userMessage]);
        const userText = message;

        setMessage("");
        setLoading(true);

        try {
            const response = await sendChat(userText);
            console.log(response.data);

            const botMessage = {
                sender: "bot",
                text: response.data.reply,
                redirect: response.data.redirect,
                action: response.data.action,
                buttonText: response.data.buttonText
            };

            setMessages((prev) => [...prev, botMessage]);

        } catch (error) {
            console.log("CHATBOT ERROR:", error);

            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "Something went wrong."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            {/* FLOATING BUTTON */}

            {!open && (

                <button
                    onClick={() => setOpen(true)}
                    style={{
                        position: "fixed",
                        bottom: "25px",
                        right: "25px",
                        width: "65px",
                        height: "65px",
                        borderRadius: "50%",
                        border: "none",
                        background: "#2f5d50",
                        color: "#fff",
                        fontSize: "26px",
                        cursor: "pointer",
                        boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
                        zIndex: 9999
                    }}
                >
                    <FaComments />
                </button>
            )}

            {/* CHATBOX */}
            {open && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        width: "380px",
                        height: "580px",
                        background: "#fff",
                        borderRadius: "25px",
                        boxShadow: "0 5px 30px rgba(0,0,0,0.25)",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        zIndex: 9999
                    }}
                >

                    {/* HEADER */}
                    <div
                        style={{
                            background: "#2f5d50",
                            color: "#fff",
                            padding: "18px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px"
                            }}
                        >
                            <FaRobot size={22} />

                            <div>
                                <div
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "18px"
                                    }}
                                >
                                    Civora Assistant
                                </div>

                                <small>
                                    24×7 Support
                                </small>
                            </div>
                        </div>

                        <FaTimes
                            size={20}
                            style={{
                                cursor: "pointer"
                            }}
                            onClick={() => setOpen(false)}
                        />

                    </div>

                    {/* CHAT AREA */}
                    <div
                        style={{
                            flex: 1,
                            padding: "15px",
                            overflowY: "auto",
                            background: "#f8f9fa"
                        }}
                    >

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        msg.sender === "user"
                                            ? "flex-end"
                                            : "flex-start",
                                    marginBottom: "15px"
                                }}
                            >

                                <div
                                    style={{
                                        maxWidth: "80%",
                                        padding: "12px 15px",
                                        borderRadius: "18px",

                                        background:
                                            msg.sender === "user"
                                                ? "#2f5d50"
                                                : "#e9ecef",

                                        color:
                                            msg.sender === "user"
                                                ? "#fff"
                                                : "#000",

                                        fontSize: "15px",
                                        lineHeight: "1.5"
                                    }}
                                >
                                    {msg.text}

                                    {
                                        (msg.redirect || msg.action) && (

                                            <div style={{ marginTop: "10px" }}>

                                                <button

                                                    onClick={() => {

                                                        // PAGE NAVIGATION
                                                        if (msg.redirect) {
                                                            navigate(msg.redirect);
                                                        }

                                                        // LOGIN MODAL
                                                        if (msg.action === "openLoginModal") {

                                                            window.dispatchEvent(
                                                                new Event("openLoginModal")
                                                            );
                                                        }

                                                        // REGISTER MODAL
                                                        if (msg.action === "openRegisterModal") {

                                                            window.dispatchEvent(
                                                                new Event("openRegisterModal")
                                                            );
                                                        }
                                                    }}

                                                    style={{
                                                        border: "none",
                                                        background: "#2f5d50",
                                                        color: "#fff",
                                                        padding: "8px 14px",
                                                        borderRadius: "10px",
                                                        cursor: "pointer",
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    {msg.buttonText}
                                                </button>

                                            </div>
                                        )
                                    }
                                </div>

                            </div>
                        ))}

                        {loading && (

                            <div
                                style={{
                                    marginTop: "10px"
                                }}
                            >
                                <small>Typing...</small>
                            </div>
                        )}

                    </div>

                    {/* QUICK BUTTONS */}

                    <div
                        style={{
                            padding: "10px",
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                            borderTop: "1px solid #ddd",
                            background: "#fff"
                        }}
                    >

                        {[
                            "How to report issue?",
                            "Track complaint",
                            "Login help",
                            "Contact admin"
                        ].map((item, index) => (

                            <button
                                key={index}
                                onClick={() => setMessage(item)}
                                style={{
                                    border: "none",
                                    background: "#d1e7dd",
                                    color: "#2f5d50",
                                    padding: "8px 12px",
                                    borderRadius: "20px",
                                    cursor: "pointer",
                                    fontSize: "13px"
                                }}
                            >
                                {item}
                            </button>
                        ))}

                    </div>

                    {/* INPUT AREA */}

                    <div
                        style={{
                            padding: "15px",
                            display: "flex",
                            gap: "10px",
                            borderTop: "1px solid #ddd",
                            background: "#fff"
                        }}
                    >

                        <input
                            type="text"
                            placeholder="Ask a question..."
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }

                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}

                            style={{
                                flex: 1,
                                border: "1px solid #ccc",
                                borderRadius: "30px",
                                padding: "12px 15px",
                                outline: "none",
                                fontSize: "15px"
                            }}
                        />

                        <button
                            onClick={sendMessage}
                            style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                border: "none",
                                background: "#2f5d50",
                                color: "#fff",
                                cursor: "pointer",
                                fontSize: "18px"
                            }}
                        >
                            <FaPaperPlane />
                        </button>

                    </div>

                </div>
            )}

        </>
    );
}
