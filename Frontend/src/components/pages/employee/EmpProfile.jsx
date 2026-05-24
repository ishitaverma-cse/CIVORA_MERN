import { useEffect, useState } from "react";
import { profile } from "../../../services/EmployeeService";
import { emp_allIssue } from "../../../services/IssueService";
import { updateProfile } from "../../../services/EmployeeService";
import { toast } from "react-toastify";

export default function EmpProfile() {

    // STATE (FIRST)
    const [employee, setEmployee] = useState(null);
    const [allIssues, setAllIssues] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("");
    const [originalEmployee, setOriginalEmployee] = useState({});

    //FETCH PROFILE
    const fetchProfile = async () => {
        try {
            const res = await profile();

            if (res.data.success) {
                setEmployee(res.data.data);
                setOriginalEmployee(res.data.data);
            }

            const issueRes = await emp_allIssue();

            if (issueRes.data.success) {
                const assignedIssues = issueRes.data.data.filter(
                    (item) => item.assignedTo?._id === res.data.data._id
                );

                setAllIssues(assignedIssues);
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);

    //HANDLE IMAGE CHANGE
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    //COUNTS 
    const totalAssigned = allIssues.length;

    const resolvedIssues = allIssues.filter(
        (item) => item.status === "Resolved"
    ).length;

    const pendingIssues = allIssues.filter(
        (item) => item.status === "Pending"
    ).length;

    //HANDLE UPDATE PROFILE
    const handleUpdateProfile = async () => {
        try {
            console.log("SAVE CLICKED");
            // NO CHANGES CHECK
            if (
                employee.name === originalEmployee.name &&
                employee.phone === originalEmployee.phone &&
                employee.address === originalEmployee.address &&
                !profileImage
            ) {
                toast.info("No changes made");
                return;
            }
            const formData = new FormData();

            formData.append("name", employee.name);
            formData.append("phone", employee.phone);
            formData.append("address", employee.address);

            if (profileImage) {
                formData.append("profileImage", profileImage);
            }

            const res = await updateProfile(formData);

            if (res.data.success) {
                setEmployee(res.data.data);
                setShowEdit(false);
            }
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <>
            <div
                className="container-fluid py-4 px-4"
                style={{
                    background: "#e6eef8"
                }}
            >
                <div
                    className="p-3 p-lg-4 mb-3"
                    style={{
                        background: "#ffffff",
                        borderRadius: "28px",
                        boxShadow: "0 4px 25px rgba(0,0,0,0.05)"
                    }}
                >

                    <div className="row align-items-center">
                        {/* LEFT */}
                        <div className="col-lg-8">
                            <div className="d-flex align-items-center gap-4 flex-wrap">
                                <img
                                    src={
                                        employee?.profileImage
                                            ? `http://localhost:3000/uploads/${employee.profileImage}`
                                            : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                    }
                                    alt="profile"
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "5px solid #edf3ff"
                                    }}
                                />

                                <div>

                                    <h2
                                        className="fw-bold mb-2"
                                        style={{ color: "#29443a" }}
                                    >
                                        {employee?.name || "Employee"}
                                    </h2>

                                    <p className="text-dark mb-3">
                                        {employee?.designation}
                                    </p>

                                    <div className="d-flex gap-2 flex-wrap">

                                        <span
                                            className="badge rounded-pill px-4 py-3"
                                            style={{
                                                background: "#e7f1ed",
                                                color: "#29443a",
                                                fontSize: "14px"
                                            }}
                                        >
                                            {employee?.categoryId?.name}
                                        </span>

                                        <span
                                            className="badge rounded-pill px-4 py-3"
                                            style={{
                                                background: "#dcfce7",
                                                color: "#166534",
                                                fontSize: "14px"
                                            }}
                                        >
                                            {employee?.address}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* RIGHT */}
                        <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">

                            <button
                                onClick={() => setShowEdit(true)}
                                className="btn rounded-pill px-4 py-2"
                                style={{
                                    background: "#29443a",
                                    color: "white"
                                }}
                            >
                                Edit Profile
                            </button>

                        </div>

                    </div>

                </div>

                {/* STATS */}
                <div className="row g-3 mb-3 text-center">
                    {
                        [
                            {
                                title: "Total Assigned",
                                value: <h2>{totalAssigned}</h2>,
                                color: "#3559b7"
                            },
                            {
                                title: "Resolved Issues",
                                value: <h2>{resolvedIssues}</h2>,
                                color: "#16a34a"
                            },
                            {
                                title: "Pending Tasks",
                                value: <h2>{pendingIssues}</h2>,
                                color: "#d97706"
                            }
                        ].map((item, index) => (

                            <div className="col-md-4" key={index}>

                                <div
                                    className="p-3"
                                    style={{
                                        background: "#ffffff",
                                        borderRadius: "24px",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
                                    }}
                                >

                                    <h2
                                        className="fw-bold mb-2"
                                        style={{
                                            color: item.color
                                        }}
                                    >
                                        {item.value}
                                    </h2>

                                    <p className="text-muted mb-0">
                                        {item.title}
                                    </p>

                                </div>

                            </div>

                        ))
                    }

                </div>

                <div
                    className="p-3"
                    style={{
                        background: "#ffffff",
                        borderRadius: "24px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
                    }}
                >

                    {/* TITLE */}
                    <h4
                        className="fw-bold mb-4"
                        style={{ color: "#29443a" }}
                    >
                        Personal Information
                    </h4>

                    {/* INFO ROWS */}
                    <div
                        className="d-flex justify-content-between align-items-center py-2"
                        style={{
                            borderBottom: "1px solid #f1f5f9"
                        }}
                    >

                        <span className="text-muted">
                            Email
                        </span>

                        <strong>
                            {employee?.email}
                        </strong>

                    </div>

                    <div
                        className="d-flex justify-content-between align-items-center py-2"
                        style={{
                            borderBottom: "1px solid #f1f5f9"
                        }}
                    >

                        <span className="text-muted">
                            Phone
                        </span>

                        <strong>
                            {employee?.phone}
                        </strong>

                    </div>

                    <div
                        className="d-flex justify-content-between align-items-center py-2"
                    >

                        <span className="text-muted">
                            Department
                        </span>

                        <strong>
                            {employee?.categoryId?.name}
                        </strong>

                    </div>

                    <div
                        className="d-flex justify-content-between align-items-center py-2"
                        style={{
                            borderBottom: "1px solid #f1f5f9"
                        }}
                    >

                        <span className="text-muted">
                            Joining Date
                        </span>

                        <strong>
                            {
                                employee?.createdAt
                                    ? new Date(employee.createdAt).toLocaleDateString()
                                    : "Not Available"
                            }
                        </strong>

                    </div>
                </div>


                {
                    showEdit && (
                        <div
                            className="modal d-block"
                            style={{
                                background: "rgba(0,0,0,0.4)"
                            }}
                        >
                            <div
                                className="modal-dialog modal-dialog-centered"
                            >
                                <div
                                    className="modal-content p-4 border-0"
                                    style={{
                                        borderRadius: "24px"
                                    }}
                                >

                                    {/* HEADER */}
                                    <div className="d-flex justify-content-between align-items-center mb-4">

                                        <h4
                                            className="fw-bold mb-0"
                                            style={{ color: "#29443a" }}
                                        >
                                            Edit Profile
                                        </h4>

                                        <button
                                            className="btn-close"
                                            onClick={() => setShowEdit(false)}
                                        ></button>

                                    </div>

                                    {/* PROFILE IMAGE */}
                                    <div
                                        className="text-center mb-4 position-relative"
                                        style={{
                                            width: "120px",
                                            margin: "0 auto"
                                        }}
                                    >

                                        <img
                                            src={
                                                previewImage
                                                    ? previewImage
                                                    : employee?.profileImage
                                                        ? `http://localhost:3000/${employee.profileImage}`
                                                        : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                            }
                                            alt="profile"
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                border: "5px solid #edf3ff"
                                            }}
                                        />

                                        {/* CAMERA BUTTON */}
                                        <label
                                            htmlFor="profileUpload"
                                            style={{
                                                position: "absolute",
                                                bottom: "5px",
                                                right: "5px",
                                                background: "#29443a",
                                                color: "white",
                                                width: "34px",
                                                height: "34px",
                                                borderRadius: "50%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                cursor: "pointer",
                                                fontSize: "14px",
                                                zIndex: 10,
                                                border: "2px solid white",
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                                            }}
                                        >
                                            <i className="bi bi-camera-fill"></i>
                                        </label>

                                        {/* INPUT */}
                                        <input
                                            type="file"
                                            id="profileUpload"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={handleImageChange}
                                        />

                                    </div>
                                    {/* NAME */}
                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Name
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={employee?.name || ""}
                                            onChange={(e) =>
                                                setEmployee({
                                                    ...employee,
                                                    name: e.target.value
                                                })
                                            }
                                        />

                                    </div>

                                    {/* PHONE */}
                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Phone
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={employee?.phone || ""}
                                            onChange={(e) =>
                                                setEmployee({
                                                    ...employee,
                                                    phone: e.target.value
                                                })
                                            }
                                        />

                                    </div>

                                    {/* ADDRESS */}
                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Address
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={employee?.address || ""}
                                            onChange={(e) =>
                                                setEmployee({
                                                    ...employee,
                                                    address: e.target.value
                                                })
                                            }
                                        />

                                    </div>

                                    {/* BUTTONS */}
                                    <div className="d-flex justify-content-end gap-2">

                                        <button
                                            className="btn btn-light px-4"
                                            onClick={() => setShowEdit(false)}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            className="btn px-4"
                                            style={{
                                                background: "#29443a",
                                                color: "white"
                                            }}
                                            onClick={handleUpdateProfile}
                                        >
                                            Save Changes
                                        </button>

                                    </div>

                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
}