import Modal from "react-modal";
import { useEffect, useState } from "react";
import ReportIssue from "./ReportIssue";
import { myIssues, deleteIssue } from "../../../../services/IssueService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        height: '650px',
        padding: '30px',
        borderRadius: '30px',
        overflow: 'auto'
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 9999
    }
};

export default function MyIssues() {
    const [issues, setIssues] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(3);

    const userId = localStorage.getItem("userId");
    const [loading, setLoading] = useState(true);
    const [editData, setEditData] = useState(null);

    // FETCH API
    async function fetchMyIssues() {
        try {
            setLoading(true);

            console.log("User ID:", userId);
            const res = await myIssues({
                reportedBy: userId
            });

            if (res.data.success) {
                setIssues(res.data.data);
            } else {
                toast.error(res.data.message);
            }

        } catch (err) {
            console.log(err);
            toast.error("Failed to load issues");
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;    //stop if not logged in

        fetchMyIssues();
    }, []);

    //OPEN / CLOSE
    function openModal(issue = null) {
        setEditData(issue);
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
        setEditData(null);
        fetchMyIssues();
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

    //HANDLE ADD ISSUE BUTTON 
    const handleAddIssueClick = () => {
        const isBlocked = localStorage.getItem("isBlocked");

        console.log("BLOCK STATUS:", isBlocked);

        if (isBlocked === "true") {
            Swal.fire({
                icon: "error",
                title: "Access Denied",
                text: "🚫 You are blocked by admin.",
                confirmButtonColor: "#d33"
            });
            return;
        }
        openModal(null);
    };

    //HANDLE DELETE
    const handleDelete = async (id) => {

        const confirm = await Swal.fire({
            title: "Delete Issue?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Delete"
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await deleteIssue({
                _id: id
            });

            if (res.data.success) {
                toast.success(res.data.message);
                fetchMyIssues();
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    return (
        <>
            <div className="container mt-4">

                {/* HEADER CARD */}
                <div
                    className="card border-0 shadow-sm rounded-5 p-4 mb-4 "
                    style={{ background: "#ffffff" }}
                >
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">

                        {/* LEFT CONTENT */}
                        <div className="d-flex align-items-start gap-3">
                            <div>
                                <h2 className="fw-bold mb-1" style={{ color: "#29443a" }}>
                                    Report Issues
                                </h2>
                            </div>
                        </div>

                        {/* RIGHT BUTTON */}
                        <div className="ms-md-auto">
                            <button
                                className="btn rounded-pill px-4 py-2"
                                style={{
                                    background: "#29443a",
                                    color: "#fff",
                                    fontWeight: "500",
                                    whiteSpace: "nowrap"
                                }}
                                onClick={handleAddIssueClick}
                            >
                                + Add New Issues
                            </button>
                        </div>

                    </div>
                </div>

                {loading ? (

                    // ================= SKELETON LOADER =================
                    <div className="position-relative">

                        {/* SKELETON ROW */}
                        <div className="row">

                            {[...Array(3)].map((_, index) => (
                                <div className="col-md-4 p-3" key={index}>

                                    <div className="issue-card h-100">

                                        {/* IMAGE */}
                                        <div
                                            style={{
                                                height: "160px",
                                                width: "100%",
                                                borderRadius: "10px",
                                                background: "#e0e0e0"
                                            }}
                                        />

                                        {/* CONTENT */}
                                        <div className="p-3">

                                            {/* TITLE */}
                                            <div
                                                style={{
                                                    height: "18px",
                                                    width: "80%",
                                                    background: "#e0e0e0",
                                                    borderRadius: "6px",
                                                    marginBottom: "10px"
                                                }}
                                            />

                                            {/* DESCRIPTION */}
                                            <div
                                                style={{
                                                    height: "14px",
                                                    width: "100%",
                                                    background: "#e0e0e0",
                                                    borderRadius: "6px",
                                                    marginBottom: "8px"
                                                }}
                                            />
                                            <div
                                                style={{
                                                    height: "14px",
                                                    width: "70%",
                                                    background: "#e0e0e0",
                                                    borderRadius: "6px",
                                                    marginBottom: "12px"
                                                }}
                                            />

                                            {/* BADGES */}
                                            <div className="d-flex gap-2 mb-3">
                                                <div
                                                    style={{
                                                        height: "22px",
                                                        width: "80px",
                                                        background: "#e0e0e0",
                                                        borderRadius: "20px"
                                                    }}
                                                />

                                                <div
                                                    style={{
                                                        height: "22px",
                                                        width: "100px",
                                                        background: "#e0e0e0",
                                                        borderRadius: "20px"
                                                    }}
                                                />
                                            </div>

                                            {/* FOOTER */}
                                            <div
                                                style={{
                                                    height: "12px",
                                                    width: "60%",
                                                    background: "#e0e0e0",
                                                    borderRadius: "6px",
                                                    marginBottom: "6px"
                                                }}
                                            />
                                            <div
                                                style={{
                                                    height: "12px",
                                                    width: "80%",
                                                    background: "#e0e0e0",
                                                    borderRadius: "6px"
                                                }}
                                            />

                                        </div>
                                    </div>

                                </div>
                            ))}

                        </div>

                    </div>

                ) : issues.length === 0 ? (

                    // ================= EMPTY STATE =================
                    <div className="text-center py-5">
                        <div style={{ fontSize: "70px" }}>📭</div>
                        <h4 className="mt-3">NO ISSUES YET</h4>
                        <p className="text-muted">
                            You haven’t reported any issues. Start by reporting one.
                        </p>
                    </div>

                ) : (

                    // ================= REAL DATA =================
                    <>
                        <div className="position-relative">
                            {/* ISSUES ROW */}
                            <div className="row">
                                {issues
                                    .slice(0, visibleCount)
                                    .map((issue) => (
                                        <div className="col-md-4 p-3" key={issue._id}>

                                            <div className="issue-card h-100">

                                                {/* IMAGE */}
                                                {issue.media && issue.media.length > 0 && (
                                                    <div className="issue-image">
                                                        <img
                                                            src={`${issue.media[0]}`}
                                                            alt="issue"
                                                        />
                                                    </div>
                                                )}

                                                {/* CONTENT */}
                                                <div className="issue-content d-flex flex-column h-100">

                                                    <h5 className="fw-semibold mb-2">
                                                        {issue.title}
                                                    </h5>

                                                    <p className="ellipsis text-muted small" title={issue.description}>
                                                        {issue.description}
                                                    </p>

                                                    <div className="mb-2">
                                                        {getStatusBadge(issue.status)}

                                                        <span className="badge bg-info text-dark ms-2">
                                                            {issue.categoryId?.name || "No Category"}
                                                        </span>
                                                    </div>

                                                    <div className="small text-muted pt-1">
                                                        📍 {issue.location}
                                                    </div>

                                                    <span className="small text-muted pt-2">
                                                        📅 {new Date(issue.createdAt).toLocaleString("en-IN", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                    </span>

                                                    <div className="d-flex gap-2 mt-3">

                                                        <button
                                                            className="btn btn-sm btn-outline-primary rounded-pill"
                                                            onClick={() => openModal(issue)}
                                                        >
                                                            ✏️ Update
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-danger rounded-pill"
                                                            onClick={() => handleDelete(issue._id)}
                                                        >
                                                            🗑 Delete
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>
                                    ))}
                            </div>

                            {/* LOAD MORE */}
                            {visibleCount < issues.length && (
                                <div className="text-center mt-4 pt-2 pb-5">
                                    <button
                                        className="btn btn-outline-success px-4 py-2 rounded-3"
                                        onClick={() => setVisibleCount(prev => prev + 3)}
                                    >
                                        Load More Issues
                                    </button>
                                </div>
                            )}

                        </div>
                    </>
                )}
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
            >
                <ReportIssue closeModal={closeModal}
                    editData={editData}
                />

            </Modal>
        </>
    );
}