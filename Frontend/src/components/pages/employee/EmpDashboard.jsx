import { useEffect, useState } from "react";
import { profile } from "../../../services/EmployeeService";
import { admin_allIssue } from "../../../services/IssueService";
import { useNavigate } from "react-router-dom";

export default function EmpDashboard() {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState({});
    const [stats, setStats] = useState({
        assigned: 0,
        pending: 0,
        progress: 0,
        resolved: 0
    });

    const [latestIssues, setLatestIssues] = useState([]);

    useEffect(() => {
        fetchEmployee();
    }, []);

    const fetchEmployee = async () => {
        try {
            const empRes = await profile();

            if (empRes.data.success) {
                setEmployee(empRes.data.data);
                fetchIssues(empRes.data.data._id);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchIssues = async (employeeId) => {
        try {
            const issueRes = await admin_allIssue();

            if (issueRes.data.success) {
                const allIssues = issueRes.data.data;
                const assignedIssues = allIssues.filter(
                    (item) => item.assignedTo?._id === employeeId
                );

                setLatestIssues(assignedIssues.slice(0, 4));
                setStats({
                    assigned: assignedIssues.length,
                    pending: assignedIssues.filter(
                        (i) => i.status === "Pending"
                    ).length,

                    progress: assignedIssues.filter(
                        (i) => i.status === "In Progress"
                    ).length,

                    resolved: assignedIssues.filter(
                        (i) => i.status === "Resolved"
                    ).length
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div
            className="min-vh-100 py-4"
            style={{
                background: "#e6eef8"
            }}
        >
            <div className="container">

                {/* TOP DASHBOARD CARD */}
                <div
                    className="card border-0 shadow-sm rounded-5 p-4 mb-4"
                    style={{
                        background: "#ffffff"
                    }}
                >
                    <div className="row align-items-center">

                        {/* LEFT */}
                        <div className="col-md-9">
                            <h1
                                className="fw-bold mb-2"
                                style={{ color: "#29443a" }}
                            >
                                Welcome, {employee?.name}
                            </h1>

                            <p className="text-muted mb-3">
                                Department Assigned
                            </p>
                            <span
                                className="badge rounded-pill px-4 py-3"
                                style={{
                                    background: "#e7f1ed",
                                    color: "#29443a",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    letterSpacing: "0.3px"
                                }}
                            >
                                {employee?.categoryId?.name || "Department"}
                            </span>

                            <span
                                className="ms-2 badge rounded-pill px-4 py-3"
                                style={{
                                    background: "#e7f1ed",
                                    color: "#6856e0",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    letterSpacing: "0.3px"
                                }}
                            >
                                {employee?.designation}
                            </span>

                        </div>

                        {/* RIGHT SECTION */}
                        <div className="col-md-3 text-md-end text-center mt-4 mt-md-0">
                            <div
                                className="d-inline-block px-4 py-3"
                                style={{
                                    background: "#e3edfa",
                                    borderRadius: "20px",
                                    border: "1px solid #edf2f7",
                                    maxWidth: "300px"
                                }}
                            >

                                <div
                                    className="text-center"
                                    style={{
                                        fontSize: "40px",
                                        color: "#29443a",
                                        opacity: 0.15
                                    }}
                                >
                                    <strong><i className="bi bi-briefcase-fill"></i></strong>
                                </div>

                                <p
                                    className="mb-1 fw-semibold text-center"
                                    style={{ color: "#29443a" }}
                                >
                                    Stay productive
                                </p>

                                <p className="text-muted text-center">
                                    Manage assigned issues efficiently and keep your workflow updated.
                                </p>

                            </div>

                        </div>

                    </div>

                    <hr className="my-4" />

                    {/* STATS */}

                    <div className="row text-center">

                        <div className="col-md-3 col-6 mb-3 mb-md-0">
                            <h3 className="fw-bold" style={{ color: "#29443a" }}>
                                {stats.assigned}
                            </h3>

                            <p className="text-muted mb-0">
                                Assigned
                            </p>
                        </div>

                        <div className="col-md-3 col-6 mb-3 mb-md-0">
                            <h3 className="fw-bold text-warning">
                                {stats.pending}
                            </h3>

                            <p className="text-muted mb-0">
                                Pending
                            </p>
                        </div>

                        <div className="col-md-3 col-6">
                            <h3 className="fw-bold text-primary">
                                {stats.progress}
                            </h3>

                            <p className="text-muted mb-0">
                                In Progress
                            </p>
                        </div>

                        <div className="col-md-3 col-6">
                            <h3 className="fw-bold text-success">
                                {stats.resolved}
                            </h3>

                            <p className="text-muted mb-0">
                                Resolved
                            </p>
                        </div>

                    </div>

                </div>

                {/* QUICK ACTIONS */}

                <div className="row g-4 mb-4">

                    <div className="col-md-4">

                        <div
                            className="card border-0 shadow-sm rounded-5 p-4 h-100"
                            style={{ background: "#ffffff" }}
                        >

                            <h5
                                className="fw-bold mb-3"
                                style={{ color: "#29443a" }}
                            >
                                Assigned Tasks
                            </h5>

                            <p className="text-muted">
                                View all issues assigned by admin and begin analysis.
                            </p>

                            <button
                                className="btn rounded-pill px-4"
                                style={{
                                    background: "#29443a",
                                    color: "white"
                                }}
                                onClick={() => navigate("/employee/issue")}
                            >
                                View Issues
                            </button>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div
                            className="card border-0 shadow-sm rounded-5 p-4 h-100"
                            style={{ background: "#ffffff" }}
                        >
                            <h5
                                className="fw-bold mb-3"
                                style={{ color: "#29443a" }}
                            >
                                Analyze Issues
                            </h5>

                            <p className="text-muted">
                                Inspect complaints, media, and citizen reports carefully.
                            </p>

                            <button
                                className="btn rounded-pill px-4"
                                style={{
                                    background: "#edf3ff",
                                    color: "#3559b7"
                                }}
                                onClick={() => navigate("/employee/issue")}
                            >
                                Start Analysis
                            </button>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div
                            className="card border-0 shadow-sm rounded-5 p-4 h-100"
                            style={{ background: "#ffffff" }}
                        >

                            <h5
                                className="fw-bold mb-3"
                                style={{ color: "#29443a" }}
                            >
                                Update Work Status
                            </h5>

                            <p className="text-muted">
                                Change issue progress and upload proof after resolution.
                            </p>

                            <button
                                className="btn rounded-pill px-4"
                                style={{
                                    background: "#e7f1ed",
                                    color: "#29443a"
                                }}
                                onClick={() => navigate("/employee/issue")}
                            >
                                Manage Updates
                            </button>

                        </div>

                    </div>

                </div>

                {/* LATEST ISSUES */}
                <div
                    className="card border-0 shadow-sm rounded-5 p-4"
                    style={{ background: "#ffffff" }}
                >

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <div>
                            <h4
                                className="fw-bold mb-3"
                                style={{ color: "#29443a" }}
                            >
                                Latest Assigned Issues
                            </h4>

                            <p className="text-muted mb-0">
                                Recently assigned complaints from admin
                            </p>
                        </div>

                        <button
                            className="btn rounded-pill px-4"
                            style={{
                                background: "#29443a",
                                color: "white"
                            }}
                            onClick={() => navigate("/employee/issue")}
                        >
                            View All
                        </button>

                    </div>

                    <div className="table-responsive">

                        <table className="table align-middle">

                            <thead>

                                <tr>

                                    <th>Issue</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    latestIssues.length > 0 ?

                                        latestIssues.map((item) => (

                                            <tr key={item._id}>

                                                <td className="fw-semibold">
                                                    {item.title}
                                                </td>

                                                <td>
                                                    <span
                                                        className="badge rounded-pill px-3 py-2"
                                                        style={{
                                                            background: "#edf3ff",
                                                            color: "#3559b7"
                                                        }}
                                                    >
                                                        {item.categoryId?.name}
                                                    </span>
                                                </td>

                                                <td>
                                                    {item.location}
                                                </td>

                                                <td>

                                                    <span
                                                        className={`badge rounded-pill px-3 py-2 ${item.status === "Pending"
                                                            ? "bg-warning"
                                                            : item.status === "In Progress"
                                                                ? "bg-primary"
                                                                : item.status === "Rejected"
                                                                ? "bg-danger"
                                                                : "bg-success"
                                                            }`}
                                                    >
                                                        {item.status}
                                                    </span>

                                                </td>

                                                <td>

                                                    <button
                                                        className="btn btn-sm rounded-pill px-3"
                                                        style={{
                                                            background: "#29443a",
                                                            color: "white"
                                                        }}
                                                        onClick={() =>
                                                            navigate("/employee/issue", {
                                                                state: { issueId: item._id }
                                                            })
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                </td>

                                            </tr>

                                        ))

                                        :

                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center text-muted py-4"
                                            >
                                                No assigned issues found
                                            </td>
                                        </tr>
                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}