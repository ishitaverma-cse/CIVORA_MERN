import Modal from "react-modal";
import { useEffect, useState } from "react";
import { admin_allIssue, admin_singleIssue, admin_deleteIssue } from "../../../../services/IssueService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        height: '550px',
        padding: '40px',
        borderRadius: '30px',
        overflow: 'auto'
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 9999
    }
};

export default function ManageIssue() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [formType, setFormType] = useState("");

    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    // const [reportedBy, setReportedBy] = useState("");
    const [aiSeverity, setAiSeverity] = useState("");
    const [status, setStatus] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [issues, setIssues] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    // OPEN / CLOSE
    function openModal(type, _id) {
        setFormType(type);
        setSelectedId(_id);

        if (type === "Edit") {
            getSingleIssue(_id);
        }

        setIsOpen(true);
    }

    function closeModal() {
        fetchIssues();
        setIsOpen(false);

        // reset form
        setTitle("");
        setDescription("");
        setStatus("open");
        setSelectedId(null);
        setFormType("");
    }


    // GET SINGLE ISSUE
    const getSingleIssue = async (id) => {
        try {
            let res = await admin_singleIssue({ _id: id });

            if (res.data.success) {
                setTitle(res.data.data.title);
                setDescription(res.data.data.description);
                setStatus(res.data.data.status);
                setLocation(res.data.data.location);
            }

        } catch (error) {
            console.log(error);
        }
    };

    // FETCH ALL ISSUES
    async function fetchIssues() {
        try {
            const res = await admin_allIssue();

            if (res?.data?.success) {
                setIssues(res.data.data);
            }

        } catch (err) {
            console.log("Fetch issues error:", err);
        }
    }

    useEffect(() => {
        fetchIssues();
    }, []);

    // SOFT DELETE 
    const deleteIssueHandler = async (id) => {

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This issue will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        // only proceed if user confirms
        if (!result.isConfirmed) return;

        try {
            const res = await admin_deleteIssue({ _id: id });

            if (res?.data?.success) {
                Swal.fire("Deleted!", res.data.message, "success");

                // instant UI update
                setIssues(prev =>
                    prev.filter(issue => issue._id !== id)
                );

            } else {
                Swal.fire("Error!", res.data.message, "error");
            }

        } catch (err) {
            console.log(err);
            Swal.fire("Error!", "Something went wrong", "error");
        }
    };

    // UPDATE STATUS
    const updateStatus = async (id, status) => {
        try {
            const res = await updateIssue({ _id: id, status });

            if (res.data.success) {
                toast.success("Status updated");

                // update UI instantly
                setIssues((prev) =>
                    prev.map((item) =>
                        item._id === id ? { ...item, status } : item
                    )
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

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

    //PAGINATION
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentIssues = issues.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(issues.length / itemsPerPage);


    return (
        <>
            <section
                id="issue-panel"
                className="section"
                style={{
                    background: "#e6eef8",
                    minHeight: "100vh"
                }}
            >

                {/* SECTION TITLE */}
                <div className="page-title light-background">
                    <div className="container d-lg-flex justify-content-between align-items-center">
                        <h1 className="mb-2 mb-lg-0">Issues</h1>
                        <nav className="breadcrumbs">
                            <ol>
                                <li>
                                    <a href="/admin/adminDashboard">Dashboard</a>
                                </li>
                                <li className="current">Issues</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* HEADER CARD */}
                <div className="container mt-4">

                    <div
                        className="card border-0 shadow-sm rounded-5 p-4 mb-4"
                        style={{ background: "#ffffff" }}
                    >
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

                            <div>
                                <h2 className="fw-bold mb-1" style={{ color: "#29443a" }}>
                                    Manage Issues
                                </h2>
                                <p className="text-muted mb-0">
                                    View, track and manage all reported issues
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* TABLE CARD */}
                    <div
                        className="card border-0 shadow-sm rounded-5 p-4"
                        style={{ background: "#ffffff" }}
                    >

                        <div className="table-responsive">

                            <table className="table align-middle text-center">

                                <thead>
                                    <tr style={{ color: "#29443a" }}>
                                        <th>#</th>
                                        <th>Media</th>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Category</th>
                                        <th>Location</th>
                                        <th>Reported By</th>
                                        <th>Status</th>
                                        <th>AI Severity</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {
                                        currentIssues.length > 0 ?

                                            currentIssues.map((item, index) => (
                                                <tr key={item._id || index}>

                                                    {/* INDEX */}
                                                    <td className="fw-semibold">
                                                        {indexOfFirstItem + index + 1}
                                                    </td>

                                                    {/* MEDIA */}
                                                    <td>
                                                        {item.media?.length ? (
                                                            <img
                                                                src={`http://localhost:3000/${item.media[0]}`}
                                                                alt="issue"
                                                                className="img-thumbnail"
                                                                style={{
                                                                    width: "60px",
                                                                    height: "60px",
                                                                    objectFit: "cover",
                                                                    borderRadius: "10px",
                                                                    cursor: "pointer"
                                                                }}
                                                                onClick={() =>
                                                                    setSelectedImage(
                                                                        `http://localhost:3000/${item.media[0]}`
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            <span className="text-muted">No Image</span>
                                                        )}
                                                    </td>

                                                    {/* TITLE */}
                                                    <td className="fw-semibold">
                                                        {item.title}
                                                    </td>

                                                    {/* DESCRIPTION */}
                                                    <td className="ellipsis text-muted" title={item.description}>
                                                        {item.description}
                                                    </td>

                                                    <td>
                                                        {item.categoryId?.name || "N/A"}
                                                    </td>

                                                    <td>
                                                        {item.location || "N/A"}
                                                    </td>

                                                    <td>
                                                        {item.reportedBy?.name || "N/A"}
                                                    </td>

                                                    {/* STATUS */}
                                                    <td>
                                                        <div className="d-flex justify-content-center">
                                                            {getStatusBadge(item.status)}
                                                        </div>
                                                    </td>

                                                    {/* AI SEVERITY */}
                                                    <td className="fw-semibold">
                                                        {item.aiSeverity || "N/A"}
                                                    </td>

                                                    {/* ACTION */}
                                                    <td>

                                                        <button
                                                            className="btn btn-sm rounded-pill px-3"
                                                            style={{
                                                                background: "#ffe7e7",
                                                                color: "#d64545",
                                                                fontWeight: "500"
                                                            }}
                                                            onClick={() =>
                                                                deleteIssueHandler(item._id)
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </td>

                                                </tr>
                                            ))

                                            :

                                            <tr>
                                                <td colSpan="10" className="text-center text-muted py-4">
                                                    No issues found
                                                </td>
                                            </tr>
                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>
                    {/* PAGINATION */}
                    {issues.length > itemsPerPage && (
                        <div className="d-flex justify-content-center mt-4 p-4">

                            <nav>
                                <ul className="pagination">

                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                        >
                                            Prev
                                        </button>
                                    </li>

                                    {[...Array(totalPages)].map((_, i) => (
                                        <li
                                            key={i}
                                            className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        </li>
                                    ))}

                                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                        >
                                            Next
                                        </button>
                                    </li>

                                </ul>
                            </nav>

                        </div>
                    )}

                </div>

                {/* IMAGE PREVIEW (UNCHANGED) */}
                {selectedImage && (
                    <div
                        className="modal fade show"
                        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.7)" }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content bg-transparent border-0">

                                <img
                                    src={selectedImage}
                                    alt="preview"
                                    style={{
                                        width: "100%",
                                        height: "400px",
                                        objectFit: "cover",
                                        backgroundColor: "#000",
                                        borderRadius: "10px"
                                    }}
                                />

                            </div>
                        </div>
                    </div>
                )}

            </section>
        </>
    )
}