import { useEffect, useState } from "react";
import {
    FaBell,
    FaCheckCircle,
    FaClock,
    FaTools
} from "react-icons/fa";

import { myNotifications, deleteNotifications } from "../../../services/NotificationService";
import { toast } from "react-toastify";


export default function Notifications() {
    const [notifications, setNotifications] = useState([]);

    //FETCH NOTIFICATION
    const fetchNotifications = async () => {
        try {
            const userId = localStorage.getItem("userId");

            const res = await myNotifications({ userId });

            console.log(localStorage.getItem("token"));
            console.log(res.data);
            if (res.data.success) {
                setNotifications(res.data.data);
            }

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    //HANDLE DELETE
    const handleDeleteNotification = async (id) => {
        try {
            const res = await deleteNotifications({
                _id: id
            });

            console.log(res.data);

            if (res.data.success) {
                setNotifications(prev =>
                    prev.filter(item => item._id !== id)
                );
                toast.success("Notification deleted");
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to delete");
        }
    };

    return (

        <main
            className="main"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(to bottom, #f4f9f7, #ffffff)"
            }}
        >
            {/* Page Title */}
            <div className="page-title light-background">
                <div className="container d-lg-flex justify-content-between align-items-center">
                    <h1 className="mb-2 mb-lg-0">
                        Notifications
                    </h1>
                    <nav className="breadcrumbs">
                        <ol>
                            <li>
                                <a href="/">
                                    Home
                                </a>
                            </li>
                            <li className="current">
                                Notifications
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
            {/* End Page Title */}


            {/* CONTENT */}
            <section className="py-3">
                <div className="container">

                    {/* EMPTY STATE */}
                    <div className="container section-title">
                        <span className="description-title">Notifications</span>
                        <h2>Notifications</h2>
                    </div>

                    {notifications.length === 0 ? (
                        <div
                            className=" text-center p-3 rounded-5 shadow-lg bg-white"
                            style={{
                                marginTop: "20px",
                                position: "relative",
                                zIndex: 10
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "70px",
                                    color: "#198754"
                                }}
                            >
                                🔔
                            </div>

                            <h2 className="fw-bold mt-4">
                                No Notifications Yet
                            </h2>

                            <p
                                className="text-muted mt-3"
                                style={{
                                    maxWidth: "600px",
                                    margin: "auto"
                                }}
                            >
                                Once your reported issues start getting
                                updates from municipal employees,
                                you'll see beautiful live tracking
                                updates here.
                            </p>

                            <div className="row mt-5 g-4">
                                <div className="col-md-4">
                                    <div
                                        className=" p-4 rounded-4 border h-100"
                                    >
                                        <FaClock
                                            size={40}
                                            className="text-warning mb-3"
                                        />
                                        <h5>
                                            In Progress Updates
                                        </h5>

                                        <p className="text-muted small">
                                            Know exactly when your issue
                                            starts getting attention.
                                        </p>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div
                                        className="
                                            p-4
                                            rounded-4
                                            border
                                            h-100
                                        "
                                    >

                                        <FaTools
                                            size={40}
                                            className="text-primary mb-3"
                                        />

                                        <h5>
                                            Employee Remarks
                                        </h5>

                                        <p className="text-muted small">
                                            Track work progress with
                                            detailed field remarks.
                                        </p>

                                    </div>

                                </div>

                                <div className="col-md-4">

                                    <div
                                        className="
                                            p-4
                                            rounded-4
                                            border
                                            h-100
                                        "
                                    >

                                        <FaCheckCircle
                                            size={40}
                                            className="text-success mb-3"
                                        />

                                        <h5>
                                            Resolution Proof
                                        </h5>

                                        <p className="text-muted small">
                                            Get proof images after your
                                            issue gets resolved.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ) : (

                        <div
                            className="timeline-wrapper"
                            style={{
                                marginTop: "-80px",
                                position: "relative",
                                zIndex: 10
                            }}
                        >

                            {notifications.map((item, index) => {

                                const statusColor =
                                    item.status === "Resolved"
                                        ? "#198754"

                                        : item.status === "In Progress"
                                            ? "#0d6efd"

                                            : item.status === "Rejected"
                                                ? "#dc3545"
                                                : "#ffc107";

                                const badgeClass =
                                    item.status === "Resolved"
                                        ? "bg-success"

                                        : item.status === "In Progress"
                                            ? "bg-primary"

                                            : item.status === "Rejected"
                                                ? "bg-danger"
                                                : "bg-warning text-dark";

                                return (
                                    <div
                                        key={index}
                                        className="
                                        d-flex
                                        align-items-start
                                        m-5
                                    "
                                    >
                                        {/* LEFT ICON */}
                                        <div
                                            className="
                                            d-flex
                                            flex-column
                                            align-items-center
                                            m-5
                                        "
                                        >
                                            <div
                                                style={{
                                                    width: "55px",
                                                    height: "50px",
                                                    borderRadius: "30%",
                                                    background: statusColor,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "white",
                                                    fontSize: "20px",
                                                    boxShadow:
                                                        "0 10px 25px rgba(0,0,0,0.15)"
                                                }}
                                            >

                                                {item.status === "Resolved"
                                                    ? <FaCheckCircle />
                                                    : <FaClock />
                                                }
                                            </div>

                                            {index !==
                                                notifications.length - 1 && (
                                                    <div
                                                        style={{
                                                            width: "4px",
                                                            flex: 1,
                                                            background: "#dfeee8",
                                                            minHeight: "30px"
                                                        }}
                                                    >
                                                    </div>
                                                )}
                                        </div>

                                        {/* CARD */}
                                        <div
                                            className="
                                            bg-white
                                            rounded-5
                                            shadow-lg
                                            p-4
                                            max-auto

                                        "
                                            style={{
                                                width: "60%"
                                            }}
                                        >

                                            {/* TOP */}
                                            <div
                                                className="
                                                    d-flex
                                                    justify-content-between
                                                    flex-wrap
                                                    gap-2
                                                    align-items-center
                                                "
                                            >

                                                <span
                                                    className={`
                                                        badge
                                                        px-4
                                                        py-2
                                                        rounded-pill
                                                        ${badgeClass}
                                                   `}
                                                >
                                                    {item.status}
                                                </span>

                                                <div className="d-flex align-items-center gap-2">

                                                    <small className="text-muted">
                                                        {new Date(item.createdAt).toLocaleString("en-IN")}
                                                    </small>

                                                    {/* DELETE BUTTON */}
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger rounded-pill"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();

                                                            console.log("DELETE CLICKED");

                                                            handleDeleteNotification(item._id);
                                                        }}
                                                    >
                                                        🗑
                                                    </button>

                                                </div>

                                            </div>

                                            {/* MESSAGE */}
                                            <h4 className="fw-bold mt-4">
                                                {item.message}

                                            </h4>

                                            {/* REMARK */}
                                            {item.remark && (

                                                <div
                                                    className="
                                                    p-3
                                                    rounded-4
                                                    mt-3
                                                "
                                                    style={{
                                                        background:
                                                            "#f5f8f7"
                                                    }}
                                                >

                                                    <strong>
                                                        Employee Remark:
                                                    </strong>

                                                    <p className="mb-0 mt-2 text-muted">

                                                        {item.remark}

                                                    </p>

                                                </div>

                                            )}

                                            {/* IMAGE */}
                                            {
                                                item.proofImage && (
                                                    <img
                                                        src={`http://localhost:3000/uploads/${item.proofImage}`}
                                                        alt="proof"
                                                        className="img-fluid rounded-4 mt-4 notification-proof"
                                                        style={{
                                                            maxHeight: "280px",
                                                            width: "100%",
                                                            objectFit: "cover"
                                                        }}
                                                    />
                                                )

                                            }

                                        </div>

                                    </div>

                                )
                            })}

                        </div>

                    )}

                </div>

            </section>

        </main>
    );
}