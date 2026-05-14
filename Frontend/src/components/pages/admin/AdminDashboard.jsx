import { useEffect, useState } from "react";
import { dashboard } from "../../../services/DashboardService";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    RadialLinearScale
} from "chart.js";

import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    RadialLinearScale
);

export default function AdminDashboard() {

    // STATE (FIRST)
    const [stats, setStats] = useState({
        total: 0,
        resolved: 0,
        pending: 0,
        inProgress: 0,
        rejected: 0,
        categoryStats: []
    });

    const [latestIssues, setLatestIssues] = useState([]);
    const safeStats = stats || {};
    const categories = stats?.categoryStats || [];
    const issues = latestIssues || [];

    //FETCH DASHBOARD -> API CALL
    const fetchDashboard = async () => {
        try {
            const res = await dashboard();

            if (res.data.success) {
                const data = res.data.data;

                setStats({
                    total: data.counts?.total || 0,
                    resolved: data.counts?.resolved || 0,
                    pending: data.counts?.pending || 0,
                    inProgress: data.counts?.inProgress || 0,
                    rejected: data.counts?.rejected || 0,
                    categoryStats: data.categoryStats || []
                });

                setLatestIssues(data.latestIssues || []);
                setLatestIssues(data.latestIssues || []);
            }

        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchDashboard();
    }, []);

    const employeeMap = {};

    issues.forEach((issue) => {
        const empName = issue.assignedTo?.name || "Unassigned";

        employeeMap[empName] = (employeeMap[empName] || 0) + 1;
    });

    const employeeLabels = Object.keys(employeeMap);
    const employeeData = Object.values(employeeMap);

    return (
        <div className="admin-dashboard">
            {/* ================= STATS ================= */}
            <section className="hotel-hero section">
                <div className="container hero-stats">
                    <div className="row text-center">

                        <StatCard icon="bi-collection" label="Total Complaints" value={stats?.total} />
                        <StatCard icon="bi-check-circle" label="Resolved" value={stats?.resolved} />
                        <StatCard icon="bi-clock" label="Pending" value={stats?.pending} />
                        <StatCard icon="bi-gear" label="In Progress" value={stats?.inProgress} />

                    </div>
                </div>
            </section>

            {/* ================= MAIN LAYOUT ================= */}
            <section className="location-cards section">
                <div className="container">
                    <div className="row gy-5">

                        {/* ================= LEFT PANEL ================= */}
                        <div className="col-lg-8">

                            {/* LATEST ISSUES (LIMITED TO 5–6) */}
                            <div className="section-title pt-0">
                                <span className="description-title">Latest Complaints</span>
                                <h2>Latest Complaints</h2>
                            </div>

                            <div className="row gy-3">
                                {latestIssues?.slice(0, 4).map((issue) => (
                                    <div key={issue._id} className="col-md-6">

                                        <div className="area-highlight shadow-sm border rounded bg-white overflow-hidden">

                                            {/* IMAGE */}
                                            <div className="area-image-wrapper position-relative">

                                                <img
                                                    src={`http://localhost:3000/${issue.media[0]}`}
                                                    alt={issue.title}
                                                    className="img-fluid w-100"
                                                    style={{ height: "160px", objectFit: "cover" }}
                                                />

                                                {/* STATUS BADGE */}
                                                <div className="area-badge">
                                                    <span>{issue.status}</span>
                                                </div>

                                                {/* CATEGORY BADGE */}
                                                <span
                                                    className="badge bg-dark position-absolute"
                                                    style={{ top: "10px", left: "10px" }}
                                                >
                                                    {issue.categoryId?.name || "Uncategorized"}
                                                </span>

                                            </div>

                                            {/* CONTENT */}
                                            <div className="area-info p-4 pt-1">

                                                {/* TITLE */}
                                                <h5 className="mb-1">{issue.title}</h5>

                                                {/* DESCRIPTION */}
                                                <p className="text-muted mb-2 ellipsis" title={issue.description} style={{ fontSize: "14px" }}>
                                                    {issue.description?.length > 80
                                                        ? issue.description.slice(0, 80) + "..."
                                                        : issue.description}
                                                </p>

                                                {/* USER + LOCATION SIDE BY SIDE */}
                                                <div className="d-flex justify-content-between align-items-center mb-2">

                                                    <small className="text-secondary">
                                                        👤 {issue.reportedBy?.name || "User"}
                                                    </small>

                                                    <small className="text-secondary">
                                                        📍 {issue.location || "Not provided"}
                                                    </small>

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ================= RIGHT PANEL (UNCHANGED) ================= */}
                        <div className="col-lg-4">
                            <div className="location-overview">

                                <div className="overview-header">
                                    <div className="location-marker">
                                        <i className="bi bi-geo-alt-fill" />
                                    </div>
                                    <h3>System Insights</h3>
                                    <p className="overview-subtitle">
                                        Overview of complaint management performance in the city
                                    </p>
                                </div>

                                <div className="benefits-list">

                                    <div className="benefit-item">
                                        <div className="benefit-icon">
                                            <i className="bi bi-train-front" />
                                        </div>
                                        <div className="benefit-content">
                                            <h6>Complaint Hub</h6>
                                            <span>All issues managed centrally</span>
                                        </div>
                                    </div>

                                    <div className="benefit-item">
                                        <div className="benefit-icon">
                                            <i className="bi bi-airplane" />
                                        </div>
                                        <div className="benefit-content">
                                            <h6>Department Coordination</h6>
                                            <span>Multiple departments involved</span>
                                        </div>
                                    </div>

                                    <div className="benefit-item">
                                        <div className="benefit-icon">
                                            <i className="bi bi-car-front" />
                                        </div>
                                        <div className="benefit-content">
                                            <h6>Admin Monitoring</h6>
                                            <span>Track complaints in real-time</span>
                                        </div>
                                    </div>

                                    <div className="benefit-item">
                                        <div className="benefit-icon">
                                            <i className="bi bi-compass" />
                                        </div>
                                        <div className="benefit-content">
                                            <h6>Citizen Access</h6>
                                            <span>Easy complaint submission & tracking</span>
                                        </div>
                                    </div>

                                </div>

                                <a href="location.html" className="location-guide-btn">
                                    <span>View Full Reports</span>
                                    <i className="bi bi-arrow-right" />
                                </a>

                            </div>

                        </div>

                    </div>
                </div>
            </section>

            {/* ================= ANALYTICS ================= */}
            <section className="analytics-section container mt-5" >
                <div className="section-title pt-0">
                    <span className="description-title">Analytics Overview</span>
                    <h2>Analytics Overview</h2>
                </div>

                {/* ROW 1 */}
                <div className="row gy-4">

                    {/* PIE CHART FIXED */}
                    <div className="col-md-6">
                        <h4 className="mb-2">Status Distribution</h4>
                        <div
                            className="card p-3 shadow-sm border-0 d-flex justify-content-center align-items-center"
                            style={{ height: "380px" }}
                        >
                            <div style={{ width: "100%", height: "300px" }}>
                                <Pie
                                    data={{
                                        labels: ["Resolved", "Pending", "In Progress", "Rejected"],
                                        datasets: [
                                            {
                                                label: "Status Distribution",
                                                data: [
                                                    safeStats.resolved,
                                                    safeStats.pending,
                                                    safeStats.inProgress,
                                                    safeStats.rejected
                                                ],
                                                backgroundColor: [
                                                    "#28a745",
                                                    "#ffc107",
                                                    "#007bff",
                                                    "#dc3545"
                                                ]
                                            }
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: "right"   // ✅ vertical legend fix
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* CATEGORY BAR */}
                    <div className="col-md-6">
                        <h4 className="mb-2">Complaints Overview</h4>
                        <div className="card p-3 shadow-sm border-0" style={{ height: "380px" }}>

                            <Bar
                                data={{
                                    labels: categories.map(i => i.name),
                                    datasets: [
                                        {
                                            label: "Complaints by Category",
                                            data: categories.map(i => i.value),
                                            backgroundColor: "#28a745"
                                        }
                                    ]
                                }}
                            />
                        </div>
                    </div>


                </div>

                {/* ROW 2 */}
                <div className="row gy-4 mt-2">
                    <div className="row gy-4 mt-2">

                        {/* EMPLOYEE PERFORMANCE */}
                        <div className="col-md-6">

                            <h5 className="mb-2">Employee Workload</h5>

                            <div
                                className="card p-3 shadow-sm border-0 d-flex justify-content-center align-items-center"
                                style={{ height: "420px" }}
                            >
                                <div style={{ width: "100%", height: "340px" }}>
                                    <Doughnut
                                        data={{
                                            labels: employeeLabels,
                                            datasets: [
                                                {
                                                    label: "Assigned Issues",
                                                    data: employeeData,
                                                    backgroundColor: [
                                                        "#007bff",
                                                        "#28a745",
                                                        "#ffc107",
                                                        "#dc3545",
                                                        "#6f42c1",
                                                        "#20c997"
                                                    ]
                                                }
                                            ]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: "right"
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* WEEKLY TREND */}
                        <div className="col-md-6">

                            <h5 className="mb-2">Weekly Complaint Trend</h5>

                            <div className="card p-3 shadow-sm border-0" style={{ height: "420px" }}>

                                <Line
                                    data={{
                                        labels: issues
                                            .slice(-7)
                                            .map((issue) =>
                                                new Date(issue.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short"
                                                })
                                            ),

                                        datasets: [
                                            {
                                                label: "Complaints",
                                                data: issues
                                                    .slice(-7)
                                                    .map((_, index) => index + 1),

                                                borderColor: "#007bff",
                                                backgroundColor: "rgba(0,123,255,0.2)",
                                                fill: true,
                                                tension: 0.4
                                            }
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false
                                    }}
                                />
                            </div>
                        </div>

                    </div>

                </div>
            </section>

        </div>
    );
}

/* ================= REUSABLE COMPONENTS ================= */

const StatCard = ({ icon, label, value }) => {
    return (
        <div className="col-md-3 col-6">
            <div className="stat-item shadow-sm p-3 rounded bg-light border">

                <div className="icon mb-2 text-primary">
                    <i className={`bi ${icon}`} style={{ fontSize: "24px" }}></i>
                </div>

                <span className="stat-number fs-4 fw-bold">
                    {value}
                </span>

                <span className="stat-label d-block text-muted">
                    {label}
                </span>

            </div>
        </div>
    );
};

const HighlightCard = ({ title, desc, badge, icon }) => {
    return (
        <div className="col-md-6">
            <div className="area-highlight shadow-sm p-3 rounded border bg-white">

                <div className="d-flex align-items-center mb-2">
                    <i className={`bi ${icon} me-2 text-primary`}></i>
                    <h5 className="mb-0">{title}</h5>
                </div>

                <p className="text-muted">{desc}</p>

                <span className="badge bg-secondary">{badge}</span>

            </div>
        </div>
    );
};

const InsightItem = ({ title, desc }) => {
    return (
        <div className="benefit-item d-flex mb-3">

            <div className="benefit-content">
                <h6 className="mb-0">{title}</h6>
                <small className="text-muted">{desc}</small>
            </div>

        </div>
    );
};