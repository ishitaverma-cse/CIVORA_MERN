import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { admin_allIssue } from "../../../../services/IssueService";
import { allEmployees } from "../../../../services/EmployeeService";
import { addAssignment, allAssignment } from "../../../../services/AssignmentService";
import Loader from "../../../common/Loader";

export default function ManageAssignments() {

    const [issues, setIssues] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selected, setSelected] = useState({});
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // FETCH DATA
    const fetchData = async () => {
        try {
            setLoading(true);

            const issueRes = await admin_allIssue();
            const empRes = await allEmployees();

            if (issueRes.data.success) {
                setIssues(issueRes.data.data);
            } else {
                toast.error(issueRes.data.message);
            }

            if (empRes.data.success) {
                setEmployees(empRes.data.data);
            }

        } catch (err) {
            console.log(err);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    // 🔹 FILTER EMPLOYEES BY CATEGORY
    const getFilteredEmployees = (categoryId) => {
        return employees.filter(
            emp => emp.categoryId?._id === categoryId
        );
    };

    //HANDLE ASSIGN
    const handleAssign = async (issueId) => {
        try {
            const employeeId = selected[issueId];

            if (!employeeId) {
                toast.error("Please select an employee");
                return;
            }

            const issue = issues.find(i => i._id === issueId);

            // 🚨 prevent duplicate assignment call
            if (issue?.assignedTo?._id === employeeId) {
                toast.info("Already assigned to this employee");
                return;
            }

            const res = await addAssignment({
                issueId,
                employeeId
            });

            if (res.data.success) {
                toast.success("Assigned successfully");

                // reset selection (IMPORTANT)
                setSelected(prev => ({
                    ...prev,
                    [issueId]: ""
                }));

                fetchData();
            } else {
                toast.error(res.data.message);
            }

        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        }
    };

    //PAGINATION
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentIssues = issues.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(issues.length / itemsPerPage);

    return (
        <section
            className="section"
            style={{
                background: "#e6eef8",
                minHeight: "100vh"
            }}
        >
            {/* SECTION TITLE */}
            <div className="page-title light-background">
                <div className="container d-lg-flex justify-content-between align-items-center">
                    <h1 className="mb-2 mb-lg-0">Assignments</h1>
                    <nav className="breadcrumbs">
                        <ol>
                            <li>
                                <a href="/admin/adminDashboard">Dashboard</a>
                            </li>
                            <li className="current">Assignments</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container mt-4">

                {/* HEADER CARD */}
                <div
                    className="card border-0 shadow-sm rounded-5 p-4 mb-4"
                    style={{ background: "#ffffff" }}
                >
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

                        <div>
                            <h2 className="fw-bold mb-1" style={{ color: "#29443a" }}>
                                Manage Assignments
                            </h2>
                            <p className="text-muted mb-0">
                                Assign issues to employees based on category
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
                                    <th>Issue</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                    <th>Assign To</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    loading ?

                                        [...Array(6)].map((_, index) => (

                                            <tr key={index}>

                                                {/* INDEX */}
                                                <td>
                                                    <div
                                                        className="skeleton mx-auto"
                                                        style={{
                                                            width: "20px",
                                                            height: "20px"
                                                        }}
                                                    ></div>
                                                </td>

                                                {/* ISSUE */}
                                                <td>
                                                    <div
                                                        className="skeleton mx-auto"
                                                        style={{
                                                            width: "140px",
                                                            height: "20px"
                                                        }}
                                                    ></div>
                                                </td>

                                                {/* CATEGORY */}
                                                <td>
                                                    <div
                                                        className="skeleton mx-auto"
                                                        style={{
                                                            width: "90px",
                                                            height: "30px",
                                                            borderRadius: "20px"
                                                        }}
                                                    ></div>
                                                </td>

                                                {/* LOCATION */}
                                                <td>
                                                    <div
                                                        className="skeleton mx-auto"
                                                        style={{
                                                            width: "150px",
                                                            height: "20px"
                                                        }}
                                                    ></div>
                                                </td>

                                                {/* ASSIGN */}
                                                <td>
                                                    <div className="d-flex justify-content-center gap-2">

                                                        <div
                                                            className="skeleton"
                                                            style={{
                                                                width: "160px",
                                                                height: "35px",
                                                                borderRadius: "8px"
                                                            }}
                                                        ></div>

                                                        <div
                                                            className="skeleton"
                                                            style={{
                                                                width: "80px",
                                                                height: "35px",
                                                                borderRadius: "20px"
                                                            }}
                                                        ></div>

                                                    </div>
                                                </td>

                                                {/* STATUS */}
                                                <td>
                                                    <div
                                                        className="skeleton mx-auto"
                                                        style={{
                                                            width: "90px",
                                                            height: "30px",
                                                            borderRadius: "20px"
                                                        }}
                                                    ></div>
                                                </td>

                                            </tr>
                                        ))

                                        :

                                        currentIssues.length > 0 ?

                                            currentIssues.map((issue, index) => (
                                                <tr key={issue._id}>

                                                    {/* INDEX */}
                                                    <td className="fw-semibold">
                                                        {indexOfFirstItem + index + 1}
                                                    </td>

                                                    {/* ISSUE */}
                                                    <td className="fw-semibold text-center">
                                                        {issue.title}
                                                    </td>

                                                    {/* CATEGORY */}
                                                    <td>
                                                        <span
                                                            className="badge rounded-pill px-3 py-2"
                                                            style={{
                                                                background: "#edf3ff",
                                                                color: "#3559b7"
                                                            }}
                                                        >
                                                            {issue.categoryId?.name}
                                                        </span>
                                                    </td>

                                                    {/* LOCATION */}
                                                    <td>
                                                        {issue.location}
                                                    </td>

                                                    {/* ASSIGN TO */}
                                                    <td>

                                                        {issue.assignedTo ? (

                                                            <span className="fw-semibold text-success">
                                                                {issue.assignedTo.name}
                                                            </span>

                                                        ) : (

                                                            <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">

                                                                <select
                                                                    className="form-select form-select-sm"
                                                                    style={{
                                                                        width: "160px",
                                                                        fontSize: "13px",
                                                                        padding: "4px 8px"
                                                                    }}
                                                                    value={selected[issue._id] || ""}
                                                                    onChange={(e) =>
                                                                        setSelected(prev => ({
                                                                            ...prev,
                                                                            [issue._id]: e.target.value
                                                                        }))
                                                                    }
                                                                >
                                                                    <option value="">Select Employee</option>

                                                                    {getFilteredEmployees(issue.categoryId?._id).map(emp => (
                                                                        <option key={emp._id} value={emp._id}>
                                                                            {emp.name}
                                                                        </option>
                                                                    ))}

                                                                </select>

                                                                <button
                                                                    className="btn btn-sm rounded-pill px-3"
                                                                    style={{
                                                                        background: "#29443a",
                                                                        color: "#fff",
                                                                        fontSize: "13px",
                                                                        padding: "5px 12px",
                                                                        whiteSpace: "nowrap"
                                                                    }}
                                                                    onClick={() => handleAssign(issue._id)}
                                                                >
                                                                    Assign
                                                                </button>

                                                            </div>

                                                        )}

                                                    </td>

                                                    {/* STATUS */}
                                                    <td>
                                                        <span
                                                            className={`badge rounded-pill px-3 py-2 ${issue.assignedTo
                                                                ? "bg-success"
                                                                : issue.status === "Rejected"
                                                                    ? "bg-danger"
                                                                    : "bg-warning text-dark"
                                                                }`}
                                                        >
                                                            {issue.assignedTo ? "Assigned" : issue.status}
                                                        </span>
                                                    </td>

                                                </tr>
                                            ))

                                            :

                                            <tr>
                                                <td colSpan="6" className="text-center text-muted py-4">
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

        </section>
    );
}
