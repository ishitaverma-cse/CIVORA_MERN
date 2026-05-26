import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import { toast } from "toastify";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { register } from "../../../services/userService";
import { login } from "../../../services/userService";
import { toast } from "react-toastify";
import { sendOtp, resetPassword } from "../../../services/userService";
import { FaBell } from "react-icons/fa";
import { myNotifications } from "../../../services/NotificationService";
import { FaTimes } from "react-icons/fa";

export default function UserHeader() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");

    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [notificationCount, setNotificationCount] = useState(0);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const isLogin = localStorage.getItem("isLogin");
    const navigate = useNavigate();

    Modal.setAppElement("#root");

    //HANDLE REGISTER FORM
    async function handleRegisterForm(e) {
        e.preventDefault();

        if (!name || !email || !password || !phone || !gender || !address) {
            toast.error("Please fill all credentials");
            return;
        }

        try {
            let formData = {
                name,
                email,
                password,
                phone,
                address,
                gender,
            };

            let res = await register(formData);

            if (res.data.success) {
                toast.success("Registered Successfully");

                setShowRegisterModal(false);

                setName("");
                setEmail("");
                setPassword("");
                setPhone("");
                setGender("");
                setAddress("");
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.log(err);

            toast.error("Something went wrong");
        }
    }

    useEffect(() => {
        const openModal = () => {
            setShowRegisterModal(true);
        };

        window.addEventListener("openRegisterModal", openModal);
        return () => {
            window.removeEventListener("openRegisterModal", openModal);
        };
    }, []);

    //HANDLE LOGIN FORM
    async function handleLoginForm(e) {
        e.preventDefault();

        if (!loginEmail || !loginPassword) {
            toast.error("All fields are required");
            return;
        }

        try {
            let formData = {
                email: loginEmail,
                password: loginPassword,
                isBlocked: false,
            };

            let res = await login(formData);

            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("isLogin", true);
                localStorage.setItem("userId", res.data.data._id);
                localStorage.setItem(
                    "isBlocked",
                    res.data.data.isBlocked ? "true" : "false",
                );

                toast.success(res.data.message);

                setShowLoginModal(false);

                const userType = res.data.data.userType;

                if (userType === 1) {
                    navigate("/admin/adminDashboard");
                } else if (userType === 2) {
                    navigate("/employee/dashboard");
                } else {
                    navigate("/");
                }
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        }
    }
    useEffect(() => {
        const openLogin = () => {
            setShowLoginModal(true);
        };
        window.addEventListener("openLoginModal", openLogin);
        return () => {
            window.removeEventListener("openLoginModal", openLogin);
        };
    }, []);

    // SEND OTP
    async function handleSendOtp() {
        if (!forgotEmail) {
            toast.error("Email required");
            return;
        }

        try {
            console.log("OTP CLICKED");

            console.log("email: ", forgotEmail);

            let res = await sendOtp({
                email: forgotEmail,
            });

            if (res.data.success) {
                toast.success("OTP sent to email");
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err);
        }
    }

    // RESET PASSWORD
    async function handleResetPassword(e) {
        e.preventDefault();

        if (!forgotEmail || !otp || !newPassword || !confirmPassword) {
            toast.error("All fields required");
            return;
        }

        try {
            let res = await resetPassword({
                email: forgotEmail,
                otp,
                newPassword,
                confirmPassword,
            });

            if (res.data.success) {
                toast.success("Password Reset Successful");

                setShowForgotModal(false);

                setShowLoginModal(true);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    }

    //FETCH NOTIF. COUNT
    const fetchNotificationCount = async () => {
        try {

            const userId = localStorage.getItem("userId");
            const res = await myNotifications({ userId });

            if (res.data.success) {
                setNotificationCount(res.data.data.length);
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchNotificationCount();
    }, []);




    return (
        <>
            <header id="header" className="header sticky-top">
                <div className="branding d-flex align-items-center">
                    <div className="container position-relative">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="logo d-flex align-items-center">
                                <h1 className="sitename">CIVORA</h1>
                            </div>
                            <nav
                                id="navmenu"
                                className={`navmenu ${mobileNavOpen ? "mobile-nav-active" : ""}`}
                            >
                                <ul>
                                    <li>
                                        <Link to="/" className="active"
                                            onClick={() => setMobileNavOpen(false)}
                                        >
                                            Home
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/about"
                                            onClick={() => setMobileNavOpen(false)}
                                        >
                                            About
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/issues"
                                            onClick={() => setMobileNavOpen(false)}
                                        >
                                            Issues
                                        </Link>
                                    </li>

                                    <li className="pe-1">
                                        <Link to="/contact"
                                            onClick={() => setMobileNavOpen(false)}
                                        >
                                            Contact
                                        </Link>
                                    </li>

                                    {!isLogin ? (
                                        <>
                                            <li className="pe-3">
                                                <button
                                                    onClick={() => {
                                                        setShowRegisterModal(true);
                                                        setMobileNavOpen(false);
                                                    }}
                                                    className="btn btn-subtle-success border border-dark text-white rounded-3 px-4 shadow"
                                                >
                                                    <i className="bi bi-box-arrow-in-right me-2"></i>
                                                    Register
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => {
                                                        setShowLoginModal(true);
                                                        setMobileNavOpen(false);
                                                    }}
                                                    className="btn btn-subtle-success border border-dark text-white rounded-3 px-4 shadow"
                                                >
                                                    <i className="bi bi-box-arrow-in-right me-2"></i>
                                                    Login
                                                </button>
                                            </li>
                                        </>
                                    ) : (
                                        <li>
                                            <button
                                                onClick={() => {
                                                    localStorage.removeItem("isLogin");
                                                    localStorage.removeItem("token");
                                                    localStorage.removeItem("userId");

                                                    setMobileNavOpen(false);
                                                    navigate("/");
                                                }}
                                                className="btn btn-subtle-success borfer border-dark text-white rounded-3 px-4 shadow"
                                            >
                                                <i className="bi bi-door-open me-2"></i>
                                                Logout
                                            </button>
                                        </li>
                                    )}

                                    <li>
                                        <Link
                                            to="/notifications"
                                            onClick={() => setMobileNavOpen(false)}
                                            style={{
                                                position: "relative",
                                                textDecoration: "none"
                                            }}
                                        >
                                            {/* BELL CONTAINER */}
                                            <div
                                                onClick={() => setMobileNavOpen(false)}
                                                style={{
                                                    width: "46px",
                                                    height: "46px",
                                                    borderRadius: "70%",
                                                    background: "rgba(255,255,255,0.12)",
                                                    backdropFilter: "blur(10px)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    border: "1px solid rgba(255,255,255,0.15)",
                                                    boxShadow: "0 6px 18px rgba(0,0,0,0.12)"
                                                }}
                                            >
                                                <FaBell
                                                    size={24}
                                                    color="white"
                                                />
                                            </div>

                                            {/* NOTIFICATION COUNT */}
                                            {
                                                notificationCount > 0 && (
                                                    <span
                                                        onClick={() => setMobileNavOpen(false)}
                                                        style={{
                                                            position: "absolute",
                                                            top: "5px",
                                                            right: "-1px",
                                                            background: "#198754",
                                                            color: "white",
                                                            minWidth: "22px",
                                                            height: "22px",
                                                            borderRadius: "50%",
                                                            fontSize: "11px",
                                                            fontWeight: "700",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            border: "2px solid white",
                                                            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                                                        }}
                                                    >
                                                        {notificationCount}
                                                    </span>
                                                )
                                            }
                                        </Link>
                                    </li>
                                </ul>
                                <i
                                    className="mobile-nav-toggle d-xl-none bi bi-list"
                                    onClick={() => setMobileNavOpen(!mobileNavOpen)}
                                />
                            </nav>
                        </div>

                    </div>
                </div>
            </header>

            {/* REGISTER */}
            <Modal
                isOpen={showRegisterModal}
                onRequestClose={() => setShowRegisterModal(false)}
                className="register-modal"
                overlayClassName="register-overlay"
            >
                <div
                    style={{
                        position: "absolute",
                        top: "18px",
                        right: "22px",
                        zIndex: 1000
                    }}
                >
                    <FaTimes
                        size={18}
                        style={{
                            cursor: "pointer",
                            color: "#444",
                            transition: "0.2s ease"
                        }}
                        onClick={() => setShowRegisterModal(false)}
                    />
                </div>

                <div className="register-container">
                    {/* LEFT FORM SIDE */}
                    <div className="register-left">
                        <div className="register-content text-center">
                            <h2>Create Account</h2>

                            <p className="text-dark">
                                <b>Join CIVORA smart citizen platform</b>
                            </p>

                            <p className="register-switch-text text-dark">
                                Already have an account?
                                <span
                                    onClick={() => {
                                        setShowRegisterModal(false);

                                        setShowLoginModal(true);
                                    }}
                                >
                                    Sign In
                                </span>
                            </p>

                            <form onSubmit={handleRegisterForm}>
                                <div className="register-grid">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />

                                    <input
                                        type="tel"
                                        maxLength={10}
                                        minLength={10}
                                        placeholder="Phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option className="text-muted">Select Gender</option>
                                    <option className="text-dark" value="Male">
                                        Male
                                    </option>
                                    <option className="text-dark" value="Female">
                                        Female
                                    </option>
                                    <option className="text-dark" value="Other">
                                        Other
                                    </option>
                                </select>

                                <textarea
                                    placeholder="Address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />

                                <button type="submit" className="bg-success">
                                    Register
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT IMAGE SIDE */}
                    <div className="register-right">
                        <img src="/assets/img/city/login_header.jpg" alt="city" />
                    </div>
                </div>
            </Modal>

            {/* LOGIN */}
            <Modal
                isOpen={showLoginModal}
                onRequestClose={() => setShowLoginModal(false)}
                className="register-modal"
                overlayClassName="register-overlay"
            >
                <div
                    style={{
                        position: "absolute",
                        top: "18px",
                        right: "22px",
                        zIndex: 1000
                    }}
                >
                    <FaTimes
                        size={18}
                        style={{
                            cursor: "pointer",
                            color: "#444",
                            transition: "0.2s ease"
                        }}
                        onClick={() => setShowLoginModal(false)}
                    />
                </div>

                <div className="register-container">
                    {/* LEFT SIDE */}
                    <div className="register-left">
                        <div className="register-content text-center">
                            <h2>Welcome Back</h2>

                            <p className="text-dark">
                                <b>Login to your CIVORA account</b>
                            </p>

                            <p className="register-switch-text text-dark">
                                New to our Community?
                                <span
                                    onClick={() => {
                                        setShowLoginModal(false);
                                        setShowRegisterModal(true);
                                    }}
                                >
                                    Sign Up
                                </span>
                            </p>

                            <button
                                type="button"
                                className=" w-100 rounded-pill mb-4 register-content button"
                            >
                                <i className="fa-brands fa-google me-2"></i>
                                <b>Sign in with Google</b>
                            </button>

                            <div className="auth-divider">
                                <hr />

                                <span>Or Sign in with email</span>

                                <hr />
                            </div>

                            <form onSubmit={handleLoginForm}>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />

                                <div className="text-end">
                                    <span
                                        className="forgot-link"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            setShowForgotModal(true);
                                            setShowLoginModal(false);
                                        }}
                                    >
                                        Forgot Password?
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    className="rounded-pill btn btn-success p-0"
                                    style={{ color: "white", border: "none" }}
                                >
                                    Log In
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="register-right">
                        <img src="/assets/img/city/login_header.jpg" alt="login" />
                    </div>
                </div>
            </Modal>

            {/* FORGOT PASSWORD MODAL */}
            <Modal
                isOpen={showForgotModal}
                onRequestClose={() => setShowForgotModal(false)}
                className="login-modal"
                overlayClassName="register-overlay"
            >
                <div
                    style={{
                        position: "absolute",
                        top: "18px",
                        right: "22px",
                        zIndex: 1000
                    }}
                >
                    <FaTimes
                        size={18}
                        style={{
                            cursor: "pointer",
                            color: "#444",
                            transition: "0.2s ease"
                        }}
                        onClick={() => setShowForgotModal(false)}
                    />
                </div>

                <div className="register-container">
                    {/* LEFT SIDE */}
                    <div className="register-left">
                        <div className="register-content text-center">
                            <h2>Reset Password</h2>

                            <p className="text-dark mb-3">
                                <b>Setup a new secure password</b>
                            </p>

                            <form onSubmit={handleResetPassword}>
                                {/* EMAIL + OTP */}
                                <div className="register-grid">
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                    />

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "10px",
                                        }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="OTP"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />

                                        <button
                                            type="button"
                                            className="otp-btn "
                                            onClick={handleSendOtp}
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>

                                {/* NEW PASSWORD */}
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />

                                {/* CONFIRM PASSWORD */}
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />

                                {/* SUBMIT */}
                                <button type="submit" className="bg-success">
                                    Submit
                                </button>
                            </form>

                            {/* BACK TO LOGIN */}
                            <p className="register-switch-text text-dark p-3">
                                Remember Password?
                                <span
                                    onClick={() => {
                                        setShowForgotModal(false);
                                        setShowLoginModal(true);
                                    }}
                                >
                                    Sign In
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="register-right">
                        <img
                            src="/assets/img/city/login_header.jpg"
                            alt="forgot-password"
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
}
