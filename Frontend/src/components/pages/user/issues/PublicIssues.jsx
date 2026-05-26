import { useEffect, useState } from "react";
import { publicIssue } from "../../../../services/IssueService";
import { toast } from "react-toastify";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import { addUpvote } from "../../../../services/UpvoteService";
import { allCategory } from "../../../../services/CategoryService";

export default function PublicIssues() {

    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [visibleCount, setVisibleCount] = useState(3);
    const [priorityFilter, setPriorityFilter] = useState("All");

    //FETCH MY ISSUES
    async function fetchMyIssues() {
        try {
            setLoading(true);

            const res = await publicIssue();

            if (res.data.success) {
                setIssues(res.data.data);
            } else {
                toast.error(res.data.message);
            }

        } catch (err) {
            console.log(err);
            toast.error("Failed to load issues");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMyIssues();
    }, []);

    //FETCH CATEGORIES
    const fetchCategories = async () => {
        const res = await allCategory();

        console.log("Categories API:", res.data);  //debug

        if (res.data.success) {
            setCategories(res.data.data);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);


    //OPEN / CLOSE
    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
        fetchMyIssues();    //refresh after submit
    }

    //STATUS 
    const getStatusBadge = (status) => {
        let color = "secondary";

        if (status === "Pending") color = "warning";
        else if (status === "In Progress") color = "info";
        else if (status === "Resolved") color = "success";
        else if (status === "Rejected") color = "danger";

        return (
            <span className={`badge bg-${color}`}>
                {status}
            </span>
        )
    };

    // HANDLE UPVOTE
    const handleUpvote = async (issueId) => {
        try {
            const userId = localStorage.getItem("userId");
            const key = `upvotedIssues_${userId}`;

            const res = await addUpvote({
                issueId,
                citizenId: userId
            });

            if (res.data.success) {

                //  LOCAL STORAGE LOGIC
                let stored = JSON.parse(localStorage.getItem(key)) || [];

                if (res.data.isUpvoted) {
                    if (!stored.includes(issueId)) {
                        stored.push(issueId);
                    }
                } else {
                    stored = stored.filter(id => id !== issueId);
                }

                localStorage.setItem(key, JSON.stringify(stored));

                setIssues(prev =>
                    prev.map(item =>
                        item._id === issueId
                            ? {
                                ...item,
                                upvotes: res.data.upvotes,
                                isUpvoted: res.data.isUpvoted
                            }
                            : item
                    )
                );
            }
        } catch (err) {
            console.log("Upvote error:", err);
        }
    };

    //FETCH ISSUES
    const fetchIssues = async () => {
        try {
            const filters = {};

            if (statusFilter && statusFilter !== "All") {
                filters.status = statusFilter;
            }

            if (categoryFilter && categoryFilter !== "All") {
                filters.categoryId = categoryFilter;
            }

            if (priorityFilter && priorityFilter !== "All") {
                filters.aiPriority = priorityFilter;
            }

            const res = await publicIssue(filters);

            if (res.data.success) {
                // GET stored upvotes
                const citizenId = localStorage.getItem("userId");
                const key = `upvotedIssues_${citizenId}`;

                let stored = JSON.parse(localStorage.getItem(key)) || [];

                // fallback to old data
                if (!stored) {
                    stored = JSON.parse(localStorage.getItem("upvotedIssues")) || [];
                }

                // MAP issues and mark isUpvoted
                const updatedIssues = res.data.data.map(issue => ({
                    ...issue,
                    isUpvoted: stored.includes(issue._id.toString())
                }));

                setIssues(updatedIssues);
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchIssues();
        setVisibleCount(3);
    }, [statusFilter, categoryFilter, priorityFilter]);


    return (
        <>
            <main className="main py-3">
                <div className="container section-title">
                    <span className="description-title">Public Issues</span>
                    <h2>Public Issues</h2>
                </div>

                <section className="filters-section ">
                    <div className="container">
                        <div className="filters-wrapper">
                            {/* 🔹 Filters */}
                            <div
                                className="p-4 rounded-5 shadow-sm mb-1"
                                style={{
                                    background: "#ffffff",
                                    border: "1px solid rgba(0,0,0,0.05)"
                                }}
                            >

                                <div className="row g-4 align-items-end">

                                    {/* STATUS */}
                                    <div className="col-lg-4 col-md-6">

                                        <label
                                            className="form-label fw-semibold mb-2"
                                            style={{ color: "#3559b7" }}
                                        >
                                            Status
                                        </label>

                                        <select
                                            className="form-select rounded-pill px-3 py-2 shadow-none"

                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                        >
                                            <option>All</option>
                                            <option>Pending</option>
                                            <option>In Progress</option>
                                            <option>Resolved</option>
                                            <option>Rejected</option>
                                        </select>

                                    </div>

                                    {/* CATEGORY */}
                                    <div className="col-lg-4 col-md-6">

                                        <label
                                            className="form-label fw-semibold mb-2"
                                            style={{ color: "#3559b7" }}
                                        >
                                            Category
                                        </label>

                                        <select
                                            className="form-select rounded-pill px-3 py-2 shadow-none"
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                        >
                                            <option>All</option>

                                            {categories.map((cat) => (

                                                <option key={cat._id} value={cat._id}>
                                                    {cat.name}
                                                </option>

                                            ))}

                                        </select>

                                    </div>

                                    {/* PRIORITY */}
                                    <div className="col-lg-4 col-md-6">
                                        <label
                                            className="form-label fw-semibold mb-2"
                                            style={{ color: "#3559b7" }}
                                        >
                                            Priority
                                        </label>

                                        <select
                                            className="form-select rounded-pill px-3 py-2 shadow-none"
                                            value={priorityFilter}
                                            onChange={(e) => setPriorityFilter(e.target.value)}
                                        >

                                            <option value="All">All</option>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>

                                        </select>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* 🔹 Cards Grid */}
                        {loading ? (
                            <div className="text-center py-5">
                                <h5>Loading issues...</h5>
                            </div>
                        ) : issues.length === 0 ? (

                            //  EMPTY STATE
                            <div className="text-center py-5">
                                <div style={{ fontSize: "70px" }}>📭</div>
                                <h4 className="mt-3">NO ISSUES YET  </h4>
                                <p className="text-muted">
                                    You haven’t reported any issues. Start by reporting one.
                                </p>
                            </div>

                        ) : (

                            // ISSUES LIST
                            <div className="row">

                                {issues.slice(0, visibleCount).map((issue) => (

                                    <div className="col-md-4 p-4 mb-3 mt-3" key={issue._id}>

                                        <div className="issue-card h-100">

                                            {/* IMAGE */}
                                            {issue.media && issue.media.length > 0 && (

                                                <div
                                                    className="issue-image position-relative overflow-hidden"
                                                    style={{
                                                        height: "230px"
                                                    }}
                                                >

                                                    {/* PRIORITY BADGE */}
                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            top: "12px",
                                                            right: "12px",
                                                            zIndex: 20,
                                                            background: "#111",
                                                            color: "#fff",
                                                            padding: "6px 14px",
                                                            borderRadius: "30px",
                                                            fontSize: "12px",
                                                            fontWeight: "700",
                                                            letterSpacing: "0.5px",
                                                            textTransform: "uppercase",
                                                            boxShadow: "0 4px 12px rgba(0,0,0,0.25)"
                                                        }}
                                                    >
                                                        {issue.aiPriority} Priority
                                                    </div>

                                                    <img
                                                        src={`${issue.media[0]}`}
                                                        alt="issue"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover"
                                                        }}
                                                    />

                                                </div>

                                            )}

                                            {/* CONTENT */}
                                            <div className="issue-content d-flex flex-column h-100">

                                                <h5 className="fw-semibold mb-2">
                                                    {issue.title}
                                                </h5>

                                                <p
                                                    className="text-muted small mb-3"
                                                    style={{
                                                        minHeight: "95px",
                                                        maxHeight: "95px",
                                                        overflow: "hidden",
                                                        lineHeight: "1.6"
                                                    }}
                                                    title={issue.description}
                                                >
                                                    {issue.description}
                                                </p>

                                                <div className="mb-2">

                                                    <span className="badge fs-6 text-dark me-1">
                                                        {getStatusBadge(issue.status)}
                                                    </span>

                                                    <span className="badge bg-info text-dark">
                                                        {issue.categoryId?.name || "No Category"}
                                                    </span>

                                                </div>

                                                <div
                                                    className="small text-muted mt-3"
                                                    style={{
                                                        minHeight: "70px"
                                                    }}
                                                >

                                                    {/* LOCATION */}
                                                    <div
                                                        className="d-flex align-items-start gap-2 mb-2"
                                                        style={{
                                                            lineHeight: "1.5"
                                                        }}
                                                    >
                                                        <span>📍</span>

                                                        <span
                                                            style={{
                                                                wordBreak: "break-word"
                                                            }}
                                                        >
                                                            {issue.location}
                                                        </span>
                                                    </div>

                                                    {/* DATE */}
                                                    <div className="d-flex align-items-center gap-2">

                                                        <span>📅</span>

                                                        <span>
                                                            {new Date(issue.createdAt).toLocaleString("en-IN", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit"
                                                            })}
                                                        </span>

                                                    </div>

                                                </div>

                                                {/* AI SEVERITY + UPVOTE */}
                                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">

                                                    {/* AI SEVERITY */}
                                                    <div className="mt-4">
                                                        <div
                                                            className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                                                            style={{
                                                                background:
                                                                    issue.aiSeverityScore >= 8
                                                                        ? "rgba(220,53,69,0.12)"
                                                                        : issue.aiSeverityScore >= 4
                                                                            ? "rgba(245,158,11,0.12)"
                                                                            : "rgba(25,135,84,0.12)",

                                                                border:
                                                                    issue.aiSeverityScore >= 8
                                                                        ? "1px solid rgba(220,53,69,0.3)"
                                                                        : issue.aiSeverityScore >= 4
                                                                            ? "1px solid rgba(245,158,11,0.3)"
                                                                            : "1px solid rgba(25, 100, 135, 0.3)"
                                                            }}
                                                        >

                                                            <span
                                                                style={{
                                                                    fontSize: "18px"
                                                                }}
                                                            >
                                                                ⚡
                                                            </span>

                                                            <span
                                                                className="fw-semibold small p-1"
                                                                style={{
                                                                    color:
                                                                        issue.aiSeverityScore >= 8
                                                                            ? "#dc3545"
                                                                            : issue.aiSeverityScore >= 4
                                                                                ? "#d97706"
                                                                                : "#198754"
                                                                }}
                                                            >
                                                                AI Severity {issue.aiSeverityScore}/10
                                                            </span>

                                                        </div>

                                                    </div>

                                                    {/* UPVOTE SECTION */}
                                                    <div
                                                        className="d-flex align-items-center justify-content-between"
                                                        style={{
                                                            marginTop: "16px"
                                                        }}
                                                    >

                                                        {/* UPVOTE BUTTON */}
                                                        <div
                                                            className={`d-flex align-items-center gap-2 px-3 py-2 rounded-pill ${issue.isUpvoted ? "bg-success-subtle" : "bg-light"}`}
                                                            style={{
                                                                cursor: "pointer",
                                                                transition: "0.3s ease",
                                                                border: issue.isUpvoted
                                                                    ? "1px solid #198754"
                                                                    : "1px solid #dee2e6"
                                                            }}
                                                            onClick={() => handleUpvote(issue._id)}
                                                        >

                                                            <span
                                                                style={{
                                                                    fontSize: "20px",
                                                                    color: issue.isUpvoted ? "#198754" : "#6c757d",
                                                                    transition: "0.2s ease"
                                                                }}
                                                            >
                                                                {issue.isUpvoted
                                                                    ? <FaThumbsUp />
                                                                    : <FaRegThumbsUp />
                                                                }
                                                            </span>

                                                            <span
                                                                className={`fw-semibold small ${issue.isUpvoted ? "text-success" : "text-muted"}`}
                                                            >
                                                                {issue.upvotes} Upvotes
                                                            </span>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>
                        )}

                        {/* LOAD MORE */}
                        {visibleCount < issues.length && (
                            <div className="text-center m-4">
                                <button
                                    className="btn btn-outline-success px-3 py-2 rounded-1"
                                    onClick={() => setVisibleCount(prev => prev + 3)}
                                >
                                    Load More Issues
                                </button>
                            </div>
                        )}

                    </div>
                </section>
            </main>
        </>
    )
}