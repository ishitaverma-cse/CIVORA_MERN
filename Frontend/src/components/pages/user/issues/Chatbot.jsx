import { useState } from "react";
import axios from "axios";

export default function Chatbot() {

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {

        if (!message.trim()) return;

        const userMessage = {
            sender: "user",
            text: message
        };

        setMessages((prev) => [...prev, userMessage]);

        setLoading(true);

        try {

            const response = await axios.post(
                "http://localhost:5000/api/chatbot/chat",
                {
                    message
                }
            );

            const botMessage = {
                sender: "bot",
                text: response.data.reply
            };

            setMessages((prev) => [...prev, botMessage]);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }

        setMessage("");
    };

    return (
        <div
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                width: "350px",
                background: "#fff",
                borderRadius: "15px",
                boxShadow: "0 0 15px rgba(0,0,0,0.2)",
                overflow: "hidden",
                zIndex: 9999
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    background: "#0d6efd",
                    color: "#fff",
                    padding: "15px",
                    fontWeight: "bold",
                    fontSize: "18px"
                }}
            >
                Civora AI Assistant
            </div>

            {/* CHAT AREA */}

            <div
                style={{
                    height: "400px",
                    overflowY: "auto",
                    padding: "10px",
                    background: "#f8f9fa"
                }}
            >

                {messages.map((msg, index) => (

                    <div
                        key={index}
                        style={{
                            textAlign:
                                msg.sender === "user"
                                    ? "right"
                                    : "left",
                            marginBottom: "10px"
                        }}
                    >

                        <span
                            style={{
                                background:
                                    msg.sender === "user"
                                        ? "#0d6efd"
                                        : "#e9ecef",

                                color:
                                    msg.sender === "user"
                                        ? "#fff"
                                        : "#000",

                                padding: "10px 14px",
                                borderRadius: "12px",
                                display: "inline-block",
                                maxWidth: "80%"
                            }}
                        >
                            {msg.text}
                        </span>

                    </div>
                ))}

                {loading && (
                    <p>Typing...</p>
                )}

            </div>

            {/* INPUT */}

            <div
                style={{
                    display: "flex",
                    padding: "10px",
                    gap: "10px",
                    borderTop: "1px solid #ddd"
                }}
            >

                <input
                    type="text"
                    placeholder="Ask about Civora..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "10px",
                        border: "1px solid #ccc"
                    }}
                />

                <button
                    onClick={sendMessage}
                    style={{
                        background: "#0d6efd",
                        color: "#fff",
                        border: "none",
                        padding: "10px 15px",
                        borderRadius: "10px",
                        cursor: "pointer"
                    }}
                >
                    Send
                </button>

            </div>

        </div>
    );
}