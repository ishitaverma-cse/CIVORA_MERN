import Modal from "react-modal";
import { useEffect, useState } from "react";
import ReportIssue from "./ReportIssue";
import { myIssues } from "../../../../services/IssueService";
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
    const [loading, setLoading] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);

    const userId = localStorage.getItem("userId");

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
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchMyIssues();
    }, []);

    //OPEN / CLOSE
    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
        fetchMyIssues();  //refresh after submit
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
        const isBlocked = localStorage.getItem("isBlocked") === "true";

        if (isBlocked) {
            Swal.fire({
                icon: "error",
                title: "Access Denied",
                text: "🚫 You are blocked by admin."
            });

            // OPTIONAL: still allow retry via backend
            // openModal(); 
            return;
        }
        openModal();
    };


    return (
        <>
            <div className="container mt-4">
                {/* HEADER CARD */}
                <div
                    className="card border-0 shadow-sm rounded-5 p-4 mb-4"
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
                                onClick={() => openModal("Add", null)}
                            >
                                + Add New Issues
                            </button>
                        </div>

                    </div>
                </div>

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

                        {issues.map((issue) => (
                            <div className="col-md-4 p-4 mb-3" key={issue._id}>
                                <div className="issue-card h-100">

                                    {/* IMAGE */}
                                    {issue.media && (
                                        <div className="issue-image">
                                            <img
                                                src={`http://localhost:3000/${issue.media}`}
                                                alt="issue"
                                            />
                                        </div>
                                    )}

                                    {/* CONTENT */}
                                    <div className="issue-content d-flex flex-column h-100">

                                        <h5 className="fw-semibold mb-2">
                                            {issue.title}
                                        </h5>

                                        <p
                                            className="ellipsis text-muted small"
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

                                        <div className="small text-muted d-flex flex-wrap gap-2 mt-auto">

                                            <span>📍 {issue.location}</span>

                                            <span>
                                                📅 {new Date(issue.createdAt).toLocaleString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>
                )}
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
            >
                <ReportIssue closeModal={closeModal} />

            </Modal>
        </>
    );
}