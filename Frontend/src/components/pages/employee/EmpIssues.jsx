import { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { emp_allIssue, emp_updateIssue } from "../../../services/IssueService";
import { profile } from "../../../services/EmployeeService";
import { useLocation } from "react-router-dom";

Modal.setAppElement("#root");

export default function EmpIssues() {
    const [allIssues, setAllIssues] = useState([]);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [activeTab, setActiveTab] = useState("All");

    const [selectedIssue, setSelectedIssue] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState("");


    const [remarks, setRemarks] = useState("");
    const [proofImage, setProofImage] = useState("");
    const [proofFile, setProofFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const location = useLocation();
    const issueId = location.state?.issueId;
    useEffect(() => {
        fetchIssues();
    }, []);


    useEffect(() => {
        console.log("Status: ", status);
    }, [status]);

    const fetchIssues = async () => {
        try {
            const empRes = await profile();

            if (empRes.data.success) {
                const employeeId = empRes.data.data._id;
                const issueRes = await emp_allIssue();
                if (issueRes.data.success) {
                    const assignedIssues = issueRes.data.data.filter(
                        (item) => item.assignedTo?._id === employeeId
                    );

                    setStatus(issueRes.data.data.status)

                    setAllIssues(assignedIssues);
                    setFilteredIssues(assignedIssues);
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {

        if (issueId && allIssues.length > 0) {

            const foundIssue = allIssues.find(
                (item) => item._id === issueId
            );

            if (foundIssue) {

                openModal(foundIssue);

                // stay on same issue card after modal close
                setTimeout(() => {

                    const element = document.getElementById(foundIssue._id);

                    if (element) {
                        element.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });
                    }

                }, 200);
            }
        }

    }, [allIssues, issueId]);

    const handleFilter = (status) => {
        setActiveTab(status);

        if (status === "All") {
            setFilteredIssues(allIssues);
        }
        else {
            const filtered = allIssues.filter(
                (item) => item.status === status
            );
            setFilteredIssues(filtered);
        }
    };

    const openModal = async (issue) => {

        try {
            const issueRes = await emp_allIssue();
            if (issueRes.data.success) {

                const freshIssue = issueRes.data.data.find(
                    (item) => item._id === issue._id
                );

                if (!freshIssue) {
                    return toast.error("Issue not found");
                }
                setSelectedIssue({
                    ...freshIssue,
                    proofImage: freshIssue.proofImage || ""
                });
                setRemarks(freshIssue.remarks || "");
                setStatus(freshIssue.status || "Pending");
                setProofFile(null);
                setIsEditing(false);
                setShowModal(true);
            }

        } catch (err) {
            console.log(err);
            toast.error("Failed to load issue");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedIssue(null);
    };

    const handleStatus = async (status) => {
        try {
            const data = {
                _id: selectedIssue?._id,
                status,
                remarks,
                proofImage
            };
            const res = await emp_updateIssue(data);

            if (res.data.success) {
                toast.success(res.data.message);
                fetchIssues();
                closeModal();
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleResolve = async () => {
        if (!remarks || remarks.trim() === "") {
            return toast.error("Remarks are required to resolve issue");
        }

        if (!proofFile && !selectedIssue.proofImage) {
            return toast.error("Proof (image/video) is required to resolve issue");
        }

        const formData = new FormData();
        formData.append("_id", selectedIssue._id);
        formData.append("status", "Resolved");
        formData.append("remarks", remarks);

        if (proofFile) {
            formData.append("proof", proofFile);
        }

        const res = await emp_updateIssue(formData);

        if (res.data.success) {
            toast.success("Issue resolved");
            fetchIssues();
            setShowModal(false);
        } else {
            toast.error(res.data.message);
        }
    };
    const startWork = async (item) => {
        const res = await emp_updateIssue({
            _id: item._id,
            status: "In Progress"
        });

        if (res.data.success) {
            toast.success("Started Work");

            fetchIssues();

            setSelectedIssue(prev =>
                prev && prev._id === item._id
                    ? { ...prev, status: "In Progress" }
                    : prev
            );
        }
    };

    //HANDLE STATUS CHANGES
    const handleStatusChange = async () => {
        console.log("Status: ", status);

        if (!selectedIssue || !selectedIssue?._id) {
            toast.error("_id is missing. Please reopen issue.");
            return;
        }

        /* REMARKS REQUIRED */
        if (!remarks || remarks.trim() === "") {
            return toast.error("Remarks are required");
        }

        /* PROOF REQUIRED */
        if (!proofFile && !selectedIssue?.proofImage) {
            return toast.error("Proof image/video is required");
        }

        /* RESOLVED VALIDATIONS */
        if (status === "Resolved") {

            if (!remarks || remarks.trim() === "") {
                return toast.error("Remarks are required");
            }

            if (!proofFile && !selectedIssue?.proofImage) {
                return toast.error("Proof image/video is required");
            }
        }

        const formData = new FormData();

        formData.append("_id", selectedIssue._id);
        formData.append("status", status);
        formData.append("remarks", remarks);

        if (proofFile) {
            formData.append("proof", proofFile);
        }

        const res = await emp_updateIssue(formData);

        if (res.data.success) {

            toast.success("Issue Updated");

            const updatedIssue = res.data.data;

            // UPDATE ALL ISSUES STATE
            setAllIssues(prev =>
                prev.map(issue =>
                    issue._id === updatedIssue._id
                        ? updatedIssue
                        : issue
                )
            );

            // UPDATE FILTERED ISSUES STATE
            setFilteredIssues(prev =>
                prev.map(issue =>
                    issue._id === updatedIssue._id
                        ? updatedIssue
                        : issue
                )
            );

            // UPDATE MODAL ISSUE
            setSelectedIssue(updatedIssue);

            // closeModal();

        } else {
            toast.error(res.data.message);
        }
    };

    //HANDLE SUBMIT
    const handleSubmit = async () => {
        const updated = await emp_updateIssue({
            id: selectedIssue._id,
            status
        });

        setSelectedIssue(updated.data); // 🔥 IMPORTANT FIX
        setIsEditing(false);
    };


    return (
        <>
            {/* SECTION TITLE */}
            <div className="page-title light-background">
                <div className="container d-lg-flex justify-content-between align-items-center">
                    <h1 className="mb-2 mb-lg-0">Issues</h1>
                    <nav className="breadcrumbs">
                        <ol>
                            <li>
                                <a href="/employee/dashboard">Dashboard</a>
                            </li>
                            <li className="current">Issues</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div
                className="min-vh-100 py-4"
                style={{ background: "#e6eef8" }}
            >

                <div className="container-fluid px-lg-5">
                    {/* HEADER */}
                    <div
                        className="card border-0 shadow-sm rounded-5 p-4 mb-4"
                        style={{ background: "#ffffff" }}
                    >

                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">

                            <div>

                                <h2
                                    className="fw-bold mb-1"
                                    style={{ color: "#29443a" }}
                                >
                                    Assigned Issues
                                </h2>

                                <p className="text-muted mb-0">
                                    Analyze complaints, update progress and resolve issues
                                </p>

                            </div>

                            <div className="mt-3 mt-md-0">

                                <span
                                    className="badge rounded-pill px-4 py-3"
                                    style={{
                                        background: "#e7f1ed",
                                        color: "#29443a",
                                        fontSize: "14px"
                                    }}
                                >
                                    Total Assigned : {allIssues.length}
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* FILTERS */}
                    <div className="employee-filter-wrapper mb-5">

                        <div className="employee-filter-box">

                            {
                                ["All", "Pending", "In Progress", "Resolved", "Rejected"].map((tab) => (

                                    <button
                                        key={tab}
                                        className={`employee-filter-btn ${activeTab === tab ? "active" : ""}`}
                                        onClick={() => handleFilter(tab)}
                                    >
                                        {tab}
                                    </button>

                                ))
                            }

                        </div>

                    </div>

                    {/* ISSUE CARDS */}
                    <div className="row g-4 justify-content-center issue-grid">
                        {
                            filteredIssues.length > 0 ?

                                filteredIssues.map((item) => (

                                    <div
                                        id={item._id}
                                        className="col-xl-4 col-lg-6"
                                        key={item._id}
                                    >

                                        <div
                                            className="issue-card h-100"
                                            style={{
                                                background: "#ffffff"
                                            }}
                                        >

                                            {/* IMAGE */}
                                            <div className="issue-image">

                                                <img
                                                    src={
                                                        item.media?.length > 0
                                                            ? item.media[0]
                                                            : "https://images.unsplash.com/photo-1581093458791-9d09f15c6d5e"
                                                    }
                                                    alt={item.title}
                                                />

                                            </div>

                                            {/* BODY */}

                                            <div className="issue-content d-flex flex-column">

                                                <div className="d-flex justify-content-between align-items-center mb-3">

                                                    <span
                                                        className="badge rounded-pill px-3 py-2"
                                                        style={{
                                                            background: "#edf3ff",
                                                            color: "#3559b7"
                                                        }}
                                                    >
                                                        {item.categoryId?.name}
                                                    </span>

                                                    <span
                                                        className="badge rounded-pill px-3 py-2"
                                                        style={{
                                                            background:
                                                                item.status === "Pending"
                                                                    ? "#fff3cd"
                                                                    : item.status === "In Progress"
                                                                        ? "#dbeafe"
                                                                        : item.status === "Resolved"
                                                                            ? "#dcfce7"
                                                                            : "#fee2e2",

                                                            color:
                                                                item.status === "Pending"
                                                                    ? "#856404"
                                                                    : item.status === "In Progress"
                                                                        ? "#1d4ed8"
                                                                        : item.status === "Resolved"
                                                                            ? "#166534"
                                                                            : "#dc2626",

                                                            fontWeight: "600"
                                                        }}
                                                    >
                                                        {item.status}
                                                    </span>

                                                </div>

                                                <h4
                                                    className="fw-semi-bold mb-2"
                                                    style={{ color: "#29443a" }}
                                                >
                                                    {item.title}
                                                </h4>

                                                <p
                                                    className="text-muted"
                                                    style={{
                                                        minHeight: "40px"
                                                    }}
                                                    title={item.description}
                                                >
                                                    {item.description?.slice(0, 90)}...
                                                </p>

                                                <div className="mt-auto">

                                                    <p className="fw-bold large">
                                                        📍 {item.location}
                                                    </p>

                                                    <p className="fw-bold large">
                                                        ⚠ Severity : {item.aiSeverityScore || 0}
                                                    </p>

                                                    <div className="d-flex gap-3 flex-wrap">

                                                        <button
                                                            className="btn rounded-pill px-4 p-1"
                                                            style={{
                                                                background: "#29443a",
                                                                color: "#ffffff"
                                                            }}
                                                            onClick={() => openModal(item)}
                                                        >
                                                            Analyze
                                                        </button>

                                                        {
                                                            item.status === "Pending" && (

                                                                <button
                                                                    className="btn btn-warning rounded-pill px-4"
                                                                    onClick={() => startWork(item)}
                                                                >
                                                                    Start Work
                                                                </button>

                                                            )
                                                        }

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                ))
                                :
                                <div className="text-center py-5">
                                    <h5 className="text-muted">
                                        No assigned issues found
                                    </h5>
                                </div>
                        }

                    </div>

                </div>

                {/* MODAL */}
                <Modal
                    isOpen={showModal}
                    onRequestClose={closeModal}
                    style={{
                        overlay: {
                            backgroundColor: "rgba(0,0,0,0.6)",
                            zIndex: 9999
                        },
                        content: {
                            inset: "50% auto auto 50%",
                            transform: "translate(-50%, -50%)",
                            width: "65%",
                            maxWidth: "750px",
                            height: "90vh",
                            borderRadius: "20px",
                            padding: "0",
                            overflow: "hidden",
                            border: "none",
                            display: "flex",
                            flexDirection: "column"
                        }
                    }}
                >
                    {selectedIssue && (
                        <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column" }}>

                            {/* HEADER */}
                            <div className="p-4 border-bottom d-flex justify-content-between align-items-start">

                                <div>
                                    <h3 className="fw-bold mb-2" style={{ color: "#29443a" }}>
                                        {selectedIssue.title}
                                    </h3>

                                    <div className="d-flex gap-2 flex-wrap">
                                        <span className="badge rounded-pill px-3 py-2"
                                            style={{ background: "#edf3ff", color: "#3559b7" }}>
                                            {selectedIssue.categoryId?.name}
                                        </span>

                                        <span className={`badge rounded-pill px-3 py-2 ${selectedIssue.status === "Pending"
                                            ? "bg-warning"
                                            : selectedIssue.status === "In Progress"
                                                ? "bg-primary"
                                                : selectedIssue.status === "Resolved"
                                                    ? "bg-success"
                                                    : "bg-danger"
                                            }`}>
                                            {selectedIssue.status}
                                        </span>
                                    </div>
                                </div>

                                <button className="btn-close" onClick={closeModal} />
                            </div>

                            {/* BODY */}
                            <div className="p-4" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>

                                {/* INFO BOXES */}
                                <div className="row g-3 mb-4">

                                    <div className="col-md-6">
                                        <div className="rounded-4 p-3" style={{ background: "#f4f7f6" }}>
                                            <small className="text-muted">Location</small>
                                            <h6 className="fw-semibold mt-1 mb-0">
                                                {selectedIssue.location}
                                            </h6>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="rounded-4 p-3" style={{ background: "#f4f7f6" }}>
                                            <small className="text-muted">Severity Score</small>
                                            <h6 className="fw-semibold mt-1 mb-0">
                                                {selectedIssue.aiSeverityScore || 0}
                                            </h6>
                                        </div>
                                    </div>

                                </div>

                                {/* UPDATE STATUS (ONLY IF NOT RESOLVED) */}
                                {selectedIssue.status !== "Resolved" && (
                                    <>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">
                                                Update Status
                                            </label>

                                            <select
                                                className="form-select rounded-4 py-2"
                                                value={status}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setStatus(value);
                                                }}
                                            // onChange={handleStatusChange}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option>In Progress</option>
                                                <option>Resolved</option>
                                                <option>Rejected</option>
                                            </select>
                                        </div>

                                        {/* PROOF */}
                                        {/* REMARKS */}
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">
                                                Remarks
                                            </label>


                                            <textarea
                                                className="form-control rounded-4"
                                                rows="2"
                                                placeholder="Add remarks"
                                                value={remarks}
                                                onChange={(e) => setRemarks(e.target.value)}
                                            />
                                        </div>

                                        {/* PROOF UPLOAD */}
                                        <div className="mb-3">

                                            <label className="form-label fw-semibold">
                                                Upload Proof
                                            </label>

                                            <input
                                                type="file"
                                                className="form-control rounded-4 py-2"
                                                accept="image/*,video/*"
                                                onChange={(e) => {
                                                    setProofFile(e.target.files[0]);
                                                }}
                                            />

                                            {
                                                proofFile && (
                                                    <div className="mt-3">
                                                        {
                                                            proofFile.type.startsWith("video/")
                                                                ? (

                                                                    <video
                                                                        controls
                                                                        className="w-100 rounded-4"
                                                                        style={{ maxHeight: "260px", objectFit: "cover" }}
                                                                    >
                                                                        <source
                                                                            src={URL.createObjectURL(proofFile)}
                                                                        />
                                                                    </video>

                                                                )
                                                                : (

                                                                    <img
                                                                        src={URL.createObjectURL(proofFile)}
                                                                        alt="proof"
                                                                        className="img-fluid rounded-4 mt-3 w-100"
                                                                        style={{
                                                                            height: "260px",
                                                                            objectFit: "cover"
                                                                        }}
                                                                    />

                                                                )
                                                        }

                                                    </div>

                                                )
                                            }

                                            {
                                                proofFile && (

                                                    <p className="small text-success mt-2 mb-0">
                                                        Selected: {proofFile.name}
                                                    </p>

                                                )
                                            }

                                        </div>


                                        <div className="mt-3 d-flex justify-content-end">
                                            <button
                                                className="btn w-100 rounded-4 py-2"
                                                style={{
                                                    background:
                                                        status === "Resolved"
                                                            ? "#198754"
                                                            : status === "Rejected"
                                                                ? "#dc3545"
                                                                : "#29443a",

                                                    color: "#fff",

                                                    fontWeight: "600"
                                                }}
                                                onClick={() => {

                                                    if (
                                                        status === selectedIssue.status &&
                                                        remarks === (selectedIssue.remarks || "") &&
                                                        !proofFile
                                                    ) {
                                                        return toast.info("No changes made");
                                                    }

                                                    handleStatusChange();
                                                }}
                                            >
                                                Submit Update
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* RESOLVED SECTION */}
                                {selectedIssue.status === "Resolved" && !isEditing && (
                                    <div className="rounded-4 p-4 mt-3" style={{ background: "#f4f7f6" }}>

                                        {/* HEADER */}
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="fw-bold mb-0">Resolution Details</h5>
                                        </div>

                                        {/* REMARKS */}
                                        <p className="mb-3">
                                            <strong>Remarks:</strong>{" "}
                                            {selectedIssue.remarks || "No remarks added"}
                                        </p>

                                        {/* PROOF MEDIA */}
                                        {console.log("Selected Issue:", selectedIssue)}
                                        {console.log("Proof Image:", selectedIssue?.proofImage)}

                                        {
                                            selectedIssue?.proofImage && (
                                                <div className="mt-4">

                                                    <h6 className="fw-bold mb-3">
                                                        Resolution Proof:
                                                    </h6>

                                                    {
                                                        selectedIssue.proofImage.includes(".mp4") ||
                                                            selectedIssue.proofImage.includes(".webm") ||
                                                            selectedIssue.proofImage.includes(".ogg")

                                                            ? (

                                                                <video
                                                                    controls
                                                                    className="w-100 rounded-4"
                                                                    style={{
                                                                        maxHeight: "320px",
                                                                        objectFit: "cover"
                                                                    }}
                                                                >
                                                                    <source
                                                                        src={selectedIssue.proofImage}
                                                                    />
                                                                </video>

                                                            )

                                                            : (

                                                                <img
                                                                    src={selectedIssue.proofImage}
                                                                    alt="proof"
                                                                    className="img-fluid rounded-4"
                                                                    style={{
                                                                        maxHeight: "320px",
                                                                        width: "100%",
                                                                        objectFit: "cover"
                                                                    }}
                                                                />

                                                            )
                                                    }

                                                </div>

                                            )
                                        }

                                        {/* PUSH BUTTON TO BOTTOM */}
                                        <div className="mt-auto pt-3">
                                            <button
                                                className="btn btn-outline-secondary w-100 rounded-3"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Edit Resolution
                                            </button>
                                        </div>
                                    </div>
                                )}



                                {selectedIssue.status === "Resolved" && isEditing && (
                                    <div className="rounded-4 p-4 mt-3" style={{ background: "#fff3cd" }}>

                                        <h5 className="fw-bold mb-3">Edit Resolution</h5>

                                        {/* STATUS */}
                                        <select
                                            className="form-select rounded-4 mb-3"
                                            value={status}
                                            onChange={(e) => {
                                                setStatus(e.target.value)
                                            }}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>

                                        {/* CANCEL */}
                                        <button
                                            className="btn btn-secondary w-100 rounded-4 mt-4"
                                            onClick={handleStatusChange}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </>
    );
}