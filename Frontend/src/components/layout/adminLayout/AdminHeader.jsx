import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { adminNotifications, adminDeleteNotifications } from "../../../services/NotificationService";

export default function AdminHeader() {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [activeTab, setActiveTab] = useState("citizens");
    const [showAll, setShowAll] = useState(false);

    const dropdownRef = useRef();
    const navigate = useNavigate();

    let nav = useNavigate()
    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("isLogin");
        localStorage.removeItem("token");
        toast.success("Logout Success");
        nav("/");

        setTimeout(() => {
            window.dispatchEvent(
                new Event("openLoginModal")
            );
        }, 100);
    }

    //FETCH NOTIF.
    const fetchNotifications = async () => {
        try {
            const res = await adminNotifications({});

            console.log("ADMIN NOTIFICATIONS:", res.data);

            if (res.data.success) {
                setNotifications(res.data.data);

                const unread = res.data.data.filter(
                    (n) => !n.isRead
                ).length;

                setUnreadCount(unread);
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(() => {
            fetchNotifications();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    //outside click effect
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    //HELPER FUNCTION
    const timeAgo = (date) => {

        const seconds = Math.floor(
            (new Date() - new Date(date)) / 1000
        );
        let interval = seconds / 31536000;

        if (interval > 1)
            return Math.floor(interval) + " yr ago";
        interval = seconds / 2592000;

        if (interval > 1)
            return Math.floor(interval) + " mo ago";
        interval = seconds / 86400;

        if (interval > 1)
            return Math.floor(interval) + " d ago";
        interval = seconds / 3600;

        if (interval > 1)
            return Math.floor(interval) + " hr ago";
        interval = seconds / 60;

        if (interval > 1)
            return Math.floor(interval) + " min ago";
        return "Just now";
    };

    const filteredNotifications = notifications.filter((n) => {

        if (activeTab === "citizens") {
            return n.type === "ISSUE_REPORTED";
        }

        if (activeTab === "employees") {
            return (
                n.type === "STATUS_UPDATED" ||
                n.type === "ISSUE_RESOLVED" ||
                n.type === "EMPLOYEE_REMARK" ||
                n.type === "ISSUE_ASSIGNED"
            );
        }

        return true;
    });

    const displayedNotifications = showAll
        ? filteredNotifications
        : filteredNotifications.slice(0, 3);

    // DELETE NOTIFICATION
    const handleDeleteNotification = async (id, e) => {
        e.stopPropagation();

        try {
            const res = await adminDeleteNotifications({
                _id: id
            });

            if (res.data.success) {
                setNotifications((prev) =>
                    prev.filter((n) => n._id !== id)
                );
                toast.success("Notification deleted");
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to delete");
        }
    };

    return (
        <>
            <header id="header" className="header sticky-top ">
                <div className="branding d-flex align-items-center">
                    <div className="container position-relative d-flex align-items-center justify-content-between">
                        <div className="logo d-flex align-items-center">
                            <h1 className="sitename">CIVORA</h1>
                        </div>

                        <nav id="navmenu" className="navmenu">
                            <ul>
                                <li>
                                    <Link to="/admin/adminDashboard" className="active">
                                        Dashboard
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/admin/employee" className="active">
                                        Employee
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/admin/category" className="active">
                                        Category
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/admin/issues" className="active">
                                        Issues
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/admin/assignments" className="active">
                                        Assignments
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/admin/user" className="active">
                                        Users
                                    </Link>
                                </li>

                                <li className="navmenu ms-2">
                                    <button onClick={logout} className="btn btn-subtle-success borfer border-dark text-white rounded-3 px-4 shadow" >
                                        <i className="bi bi-door-open me-2"></i>
                                        Logout
                                    </button>
                                </li>

                                <li className="navmenu ps-0 position-relative ms-4"
                                    ref={dropdownRef}
                                >

                                    {/* BELL BUTTON */}
                                    <div
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        style={{
                                            position: "relative",
                                            textDecoration: "none",
                                            cursor: "pointer"
                                        }}
                                    >

                                        {/* BELL CONTAINER */}
                                        <div
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
                                            <i
                                                className="bi bi-bell-fill"
                                                style={{
                                                    fontSize: "22px",
                                                    color: "white"
                                                }}
                                            ></i>
                                        </div>

                                        {/* NOTIFICATION COUNT */}
                                        {unreadCount > 0 && (
                                            <span
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
                                                {unreadCount}
                                            </span>
                                        )}

                                    </div>

                                    {/* DROPDOWN */}
                                    {showDropdown && (
                                        <div
                                            className="shadow-lg"
                                            style={{
                                                position: "absolute",
                                                right: "-20px",
                                                top: "60px",
                                                width: "370px",
                                                background: "#fff",
                                                borderRadius: "18px",
                                                zIndex: 9999,
                                                overflow: "hidden",
                                                border: "1px solid #ececec"
                                            }}
                                        >

                                            {/* HEADER */}
                                            <div
                                                className="d-flex justify-content-between align-items-center px-4 py-3"
                                                style={{
                                                    borderBottom: "1px solid #f1f1f1"
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        fontWeight: "700",
                                                        fontSize: "18px",
                                                        color: "#222"
                                                    }}
                                                >
                                                    Notifications
                                                </div>

                                                <div
                                                    onClick={() => setShowAll(prev => !prev)}
                                                    style={{
                                                        color: "#4f46e5",
                                                        fontSize: "14px",
                                                        fontWeight: "600",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    {showAll ? "Show less" : "See all"}
                                                </div>
                                            </div>

                                            {/* TABS */}
                                            <div
                                                className="d-flex px-3 pt-2"
                                                style={{
                                                    borderBottom: "1px solid #f3f3f3",
                                                    gap: "20px"
                                                }}
                                            >

                                                {/* CITIZENS */}
                                                <div
                                                    onClick={() => setActiveTab("citizens")}
                                                    style={{
                                                        fontSize: "14px",
                                                        fontWeight: activeTab === "citizens"
                                                            ? "600"
                                                            : "500",

                                                        color: activeTab === "citizens"
                                                            ? "#4f46e5"
                                                            : "#888",

                                                        paddingBottom: "10px",

                                                        borderBottom:
                                                            activeTab === "citizens"
                                                                ? "2px solid #4f46e5"
                                                                : "none",

                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Citizens
                                                </div>

                                                {/* EMPLOYEES */}
                                                <div
                                                    onClick={() => setActiveTab("employees")}
                                                    style={{
                                                        fontSize: "14px",

                                                        fontWeight: activeTab === "employees"
                                                            ? "600"
                                                            : "500",

                                                        color: activeTab === "employees"
                                                            ? "#4f46e5"
                                                            : "#888",

                                                        paddingBottom: "10px",
                                                        paddingLeft: "20px",

                                                        borderBottom:
                                                            activeTab === "employees"
                                                                ? "2px solid #4f46e5"
                                                                : "none",

                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Employees
                                                </div>

                                            </div>

                                            {/* LIST */}
                                            <div
                                                style={{
                                                    maxHeight: "430px",
                                                    overflowY: "auto"
                                                }}
                                            >

                                                {filteredNotifications.length === 0 ? (
                                                    <div
                                                        className="d-flex flex-column align-items-center justify-content-center"
                                                        style={{
                                                            padding: "55px 20px",
                                                            color: "#999"
                                                        }}
                                                    >

                                                        <div style={{ fontSize: "42px" }}>
                                                            🔔
                                                        </div>

                                                        <div
                                                            style={{
                                                                fontWeight: "600",
                                                                marginTop: "12px",
                                                                fontSize: "15px",
                                                                color: "#555"
                                                            }}
                                                        >
                                                            No notifications yet
                                                        </div>

                                                        <div
                                                            style={{
                                                                fontSize: "13px",
                                                                marginTop: "4px",
                                                                textAlign: "center",
                                                                color: "#999"
                                                            }}
                                                        >
                                                            You're all caught up for now.
                                                        </div>

                                                    </div>

                                                ) : (

                                                    displayedNotifications.map((n) => {
                                                        console.log(
                                                            n.issueId?.categoryId?.name
                                                        );
                                                        return (

                                                            <div
                                                                key={n._id}
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/admin/issues?issueId=${n.issueId?._id}`
                                                                    )
                                                                }
                                                                style={{
                                                                    padding: "16px 18px",
                                                                    borderBottom: "1px solid #f1f1f1",
                                                                    cursor: "pointer",
                                                                    transition: "0.2s",
                                                                    display: "flex",
                                                                    gap: "14px",
                                                                    alignItems: "flex-start",
                                                                    borderRadius: "14px",
                                                                    transform: "translateY(0px)",
                                                                    background: !n.isRead
                                                                        ? "#fafcff"
                                                                        : "#fff",
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.background = "#f7f8ff";
                                                                    e.currentTarget.style.transform = "translateY(-2px)";
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.background =
                                                                        !n.isRead
                                                                            ? "#fafcff"
                                                                            : "#fff";
                                                                    e.currentTarget.style.transform = "translateY(0px)";
                                                                }}
                                                            >

                                                                {/* ICON */}
                                                                <div
                                                                    style={{
                                                                        minWidth: "46px",
                                                                        height: "46px",
                                                                        borderRadius: "50%",
                                                                        background: "#f5f5f5",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        fontSize: "20px"
                                                                    }}
                                                                >
                                                                    {
                                                                        n.issueId?.categoryId?.name
                                                                            ?.toLowerCase()
                                                                            .includes("road")

                                                                            ? "🛠️"

                                                                            : n.issueId?.categoryId?.name
                                                                                ?.toLowerCase()
                                                                                .includes("traffic")

                                                                                ? "🚦"

                                                                                : n.issueId?.categoryId?.name
                                                                                    ?.toLowerCase()
                                                                                    .includes("street")

                                                                                    ? "💡"

                                                                                    : n.issueId?.categoryId?.name
                                                                                        ?.toLowerCase()
                                                                                        .includes("water")

                                                                                        ? "💧"

                                                                                        : n.issueId?.categoryId?.name
                                                                                            ?.toLowerCase()
                                                                                            .includes("garbage")

                                                                                            ? "🗑️"

                                                                                            : "📌"
                                                                    }

                                                                </div>

                                                                {/* CONTENT */}
                                                                <div style={{ flex: 1 }}>

                                                                    {/* TOP */}
                                                                    <div
                                                                        className="d-flex justify-content-between align-items-start gap-2"
                                                                    >
                                                                        {/* ISSUE TITLE */}
                                                                        <div
                                                                            style={{
                                                                                fontWeight: "700",
                                                                                fontSize: "15px",
                                                                                color: "#222",
                                                                                lineHeight: "1.4"
                                                                            }}
                                                                        >
                                                                            {n.issueId?.title}
                                                                        </div>

                                                                        {/* TIME */}
                                                                        <div
                                                                            style={{
                                                                                fontSize: "12px",
                                                                                color: "#999",
                                                                                whiteSpace: "nowrap",
                                                                                paddingLeft: "50px"
                                                                            }}
                                                                        >
                                                                            {timeAgo(n.createdAt)}
                                                                        </div>

                                                                        {/* DELETE BUTTON */}
                                                                        <button
                                                                            onClick={(e) =>
                                                                                handleDeleteNotification(n._id, e)
                                                                            }
                                                                            style={{
                                                                                border: "none",
                                                                                background: "transparent",
                                                                                color: "#dc3545",
                                                                                cursor: "pointer",
                                                                                fontSize: "15px"
                                                                            }}
                                                                        >
                                                                            <i className="bi bi-trash"></i>
                                                                        </button>

                                                                    </div>
                                                                    {activeTab === "citizens" && n.issueId?.media && (
                                                                        <img
                                                                            src={n.issueId.media}
                                                                            alt="issue"
                                                                            style={{
                                                                                width: "100%",
                                                                                height: "120px",
                                                                                objectFit: "cover",
                                                                                borderRadius: "12px",
                                                                                marginTop: "12px"
                                                                            }}
                                                                        />
                                                                    )}

                                                                    {/* PROOF IMAGE */}
                                                                    {activeTab === "employees" && n.proofImage && (
                                                                        <img
                                                                            src={`${n.proofImage}`}
                                                                            alt="proof"
                                                                            style={{
                                                                                width: "100%",
                                                                                height: "120px",
                                                                                objectFit: "cover",
                                                                                borderRadius: "12px",
                                                                                marginTop: "12px"
                                                                            }}
                                                                        />
                                                                    )}

                                                                    {/* REPORTED BY */}
                                                                    <div
                                                                        style={{
                                                                            fontSize: "13px",
                                                                            color: "#777",
                                                                            marginTop: "4px"
                                                                        }}
                                                                    >
                                                                        Reported by{" "}
                                                                        <span style={{ fontWeight: "600" }}>
                                                                            {n.issueId?.reportedBy?.name || "Citizen"}
                                                                        </span>
                                                                    </div>

                                                                    {/* STATUS */}
                                                                    {activeTab === "employees" && (
                                                                        <div
                                                                            style={{
                                                                                marginTop: "8px"
                                                                            }}
                                                                        >
                                                                            <span
                                                                                className={`badge ${n.status === "Resolved"
                                                                                    ? "bg-success"
                                                                                    : n.status === "Rejected"
                                                                                        ? "bg-danger"
                                                                                        : n.status === "In Progress"
                                                                                            ? "bg-primary"
                                                                                            : "bg-warning text-dark"
                                                                                    }`}
                                                                            >
                                                                                {n.status || "Pending"}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                )}

                                            </div>

                                        </div>
                                    )}

                                </li>

                            </ul>

                        </nav>
                    </div>
                </div>
            </header>


        </>
    )
}