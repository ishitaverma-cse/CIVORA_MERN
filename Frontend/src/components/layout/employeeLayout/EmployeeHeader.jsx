import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { profile } from "../../../services/EmployeeService";

export default function EmployeeHeader() {
    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);
    const [employee, setEmployee] = useState(null);

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("isLogin");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        toast.success("Logout Success")
        navigate("/");

        setTimeout(() => {
            window.dispatchEvent(
                new Event("openLoginModal")
            );
        }, 100);
    }

    //FETCH PROFILE
    const fetchProfile = async () => {
        try {
            const res = await profile();

            if (res.data.success) {
                setEmployee(res.data.data);
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);


    return (
        <>
            <header id="header" className="header sticky-top ">
                <div className="branding d-flex align-items-cente">
                    <div className="container position-relative d-flex align-items-center justify-content-between">
                        <div to="index.html" className="logo d-flex align-items-center">
                            {/* Uncomment the line below if you also wish to use an image logo */}
                            {/* <img src="assets/img/logo.webp" alt=""> */}
                            <h1 className="sitename">Civora</h1>
                        </div>
                        <nav id="navmenu" className="navmenu">
                            <ul>
                                <li>
                                    <Link to="/employee/dashboard" className="active">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/employee/issue" className="active">
                                        Issues
                                    </Link>
                                </li>

                                {/* <li className="navmenu ms-2">
                                    <button onClick={logout} className="btn btn-subtle-success border border-dark text-white rounded-3 px-4 shadow" >
                                        <i class="bi bi-door-open me-2"></i>
                                        Logout
                                    </button>
                                </li> */}

                                <li className="dropdown list-unstyled">
                                    <Link to="#">
                                        <div
                                            style={{
                                                width: "38px",
                                                height: "38px",
                                                borderRadius: "50%",
                                                background: "linear-gradient(135deg, #198754, #146c43)",
                                                color: "white",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "700",
                                                fontSize: "16px",
                                                marginRight: "10px",
                                                border: "2px solid rgba(255,255,255,0.3)",
                                                textTransform: "uppercase"
                                            }}
                                        >
                                            {employee?.name?.charAt(0)}
                                        </div>

                                        {/* <i className="bi bi-chevron-down toggle-dropdown" /> */}
                                    </Link>
                                    <ul>
                                        <li>
                                            <Link to="/employee/profile">
                                                👤 My Profile
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to="/employee/issue">
                                                📋 My Issues
                                            </Link>
                                        </li>

                                        <li>
                                            <button
                                                onClick={logout}
                                                style={{
                                                    border: "none",
                                                    background: "transparent",
                                                    width: "100%",
                                                    textAlign: "left",
                                                    padding: "10px 18px"
                                                }}
                                            >
                                                🚪 Logout
                                            </button>
                                        </li>
                                    </ul>
                                </li>

                                {/* <li className="dropdown">
                                    <Link to="#english">
                                        <svg
                                            className="icon"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g id="SVGRepo_iconCarrier">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M4 0H6V2H10V4H8.86807C8.57073 5.66996 7.78574 7.17117 6.6656 8.35112C7.46567 8.73941 8.35737 8.96842 9.29948 8.99697L10.2735 6H12.7265L15.9765 16H13.8735L13.2235 14H9.77647L9.12647 16H7.0235L8.66176 10.9592C7.32639 10.8285 6.08165 10.3888 4.99999 9.71246C3.69496 10.5284 2.15255 11 0.5 11H0V9H0.5C1.5161 9 2.47775 8.76685 3.33437 8.35112C2.68381 7.66582 2.14629 6.87215 1.75171 6H4.02179C4.30023 6.43491 4.62904 6.83446 4.99999 7.19044C5.88743 6.33881 6.53369 5.23777 6.82607 4H0V2H4V0ZM12.5735 12L11.5 8.69688L10.4265 12H12.5735Z"
                                                    fill="currentColor"
                                                />
                                            </g>
                                        </svg>
                                        <span>English</span>
                                        <i className="bi bi-chevron-down toggle-dropdown" />
                                    </Link>
                                    <ul>
                                        <li>
                                            <Link to="#french">French</Link>
                                        </li>
                                        <li>
                                            <Link to="#deutsch">Deutsch</Link>
                                        </li>
                                        <li>
                                            <Link to="#spanish">Spanish</Link>
                                        </li>
                                    </ul>
                                </li> */}
                            </ul>
                            <i className="mobile-nav-toggle d-xl-none bi bi-list" />
                        </nav>
                    </div>
                </div>
            </header>

        </>
    )
}