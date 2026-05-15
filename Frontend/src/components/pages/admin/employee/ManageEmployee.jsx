import Modal from "react-modal";
import { useEffect, useState } from "react";
import { allCategory } from "../../../../services/CategoryService";
import { addEmployee, allEmployee, singleEmployee, updateEmployee, deleteEmployee } from "../../../../services/EmployeeService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
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

export default function ManageEmployee() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [designation, setDesignation] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [salary, setSalary] = useState("");
    const [address, setAddress] = useState("");

    const [categories, setCategories] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [formType, setFormType] = useState("");
    const [employees, setEmployees] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // OPEN / CLOSE
    function openModal(type, _id) {
        setFormType(type);
        formType === "Edit"
        setSelectedId(_id);
        if (type === "Edit") {
            getSingleEmployee(_id);
        }
        setIsOpen(true);
    }

    function closeModal() {
        // refresh employee table
        fetchEmployees();

        //reset all employee fields
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setDesignation("");
        setCategoryId("");
        setSalary("");
        setAddress("");

        setSelectedId(null);
        setFormType("");

        setIsOpen(false);
    }

    const getSingleEmployee = async (id) => {
        try {
            const res = await singleEmployee({ _id: id });

            if (res.data.success) {
                const data = res.data.data;

                setName(data.name || "");
                setEmail(data.email || "");
                setPhone(data.phone || "");
                setDesignation(data.designation || "");
                setCategoryId(data.categoryId?._id || data.categoryId || "");
                setSalary(data.salary);
                setAddress(data.address);
                setPassword(data.password);
            }

        } catch (err) {
            console.log(err);
        }
    };

    // HANDLE SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("SUBMIT CLICKED");  // debug
        console.log("PASSWORD", password);  // debug
        const formData = {
            name,
            email,
            phone,
            password,
            designation,
            categoryId,
            salary,
            address
        };

        try {
            const res = await addEmployee(formData);

            if (res.data.success) {
                toast.success(res.data.message || "Employee Added");

                fetchEmployees();    // refresh table
                closeModal();
            } else {
                toast.error(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    // FETCH EMPLOYEES
    async function fetchEmployees() {
        try {
            const res = await allEmployee();

            if (res.data.success) {
                setEmployees(res.data.data);
            }

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchEmployees();
    }, []);

    //UPDATE
    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = {
            _id: selectedId,
            name,
            email,
            phone,
            password,
            designation,
            categoryId,
            salary,
            address
        };

        try {
            const res = await updateEmployee(formData);

            if (res.data.success) {
                toast.success(res.data.message);
                fetchEmployees();   // refresh table
                closeModal();       // close modal
            } else {
                toast.error(res.data.message);
            }

        } catch (err) {
            console.log(err);
            toast.error("Update failed");
        }
    };


    //DELETE 
    const deleteEmployeeHandler = async (id) => {

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This employee will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        // stop if user cancels
        if (!result.isConfirmed) return;

        try {
            const res = await deleteEmployee({ _id: id });

            if (res.data.success) {

                await Swal.fire({
                    title: "Deleted!",
                    text: res.data.message,
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });

                // instant UI update
                setEmployees(prev =>
                    prev.filter(emp => emp._id !== id)
                );

            } else {
                Swal.fire("Error!", res.data.message, "error");
            }

        } catch (err) {
            console.log(err);
            Swal.fire("Error!", "Something went wrong", "error");
        }
    };

    //FETCH CATEGORIES
    async function fetchCategories() {
        try {
            const res = await allCategory();

            if (res.data.success) {
                setCategories(res.data.data);
            }

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    //PAGINATION LOGIC
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(employees.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    return (
        <>
            <section
                id="category-panel"
                className="section"
                style={{ background: "#e6eef8" }}
            >
                {/* SECTION TITLE */}
                <div className="page-title light-background">
                    <div className="container d-lg-flex justify-content-between align-items-center">
                        <h1 className="mb-2 mb-lg-0">Employee</h1>
                        <nav className="breadcrumbs">
                            <ol>
                                <li>
                                    <a href="/admin/adminDashboard">Dashboard</a>
                                </li>
                                <li className="current">Employee</li>
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
                                    Manage Employees
                                </h2>
                                <p className="text-muted mb-0">
                                    Add, update and remove employees from system
                                </p>
                            </div>

                            <button
                                className="btn rounded-pill px-4 py-2"
                                style={{
                                    background: "#29443a",
                                    color: "#fff",
                                    fontWeight: "500"
                                }}
                                onClick={() => openModal("Add", null)}
                            >
                                + Add New Employee
                            </button>

                        </div>
                    </div>

                    {/* TABLE CARD */}
                    <div
                        className="card border-0 shadow-sm rounded-5 p-4"
                        style={{ background: "#ffffff" }}
                    >

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0" style={{ color: "#29443a" }}>
                                Employee List
                            </h5>
                        </div>

                        <div className="table-responsive">

                            <table className="table align-middle">

                                <thead>
                                    <tr style={{ color: "#29443a" }}>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Designation</th>
                                        <th>Department</th>
                                        <th>Salary</th>
                                        <th>Address</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        employees.length > 0 ?
                                            currentEmployees.map((item, index) => (
                                                <tr key={item._id || index}>

                                                    <td className="fw-semibold">
                                                        {indexOfFirstItem + index + 1}
                                                    </td>

                                                    <td className="fw-semibold">
                                                        {item.name}
                                                    </td>

                                                    <td>{item.email}</td>
                                                    <td>{item.phone}</td>
                                                    <td>{item.designation}</td>

                                                    <td>
                                                        <span
                                                            className="badge rounded-pill px-3 py-2"
                                                            style={{
                                                                background: "#edf3ff",
                                                                color: "#3559b7"
                                                            }}
                                                        >
                                                            {item?.categoryId?.name}
                                                        </span>
                                                    </td>

                                                    <td className="fw-semibold">
                                                        ₹ {item.salary}
                                                    </td>

                                                    <td>{item.address}</td>

                                                    {/* ACTIONS */}
                                                    <td className="text-center">

                                                        <button
                                                            className="btn btn-sm rounded-pill px-3 me-2"
                                                            style={{
                                                                background: "#edf3ff",
                                                                color: "#3559b7",
                                                                fontWeight: "500"
                                                            }}
                                                            onClick={() => openModal("Edit", item._id)}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="btn btn-sm rounded-pill px-3"
                                                            style={{
                                                                background: "#ffe7e7",
                                                                color: "#d64545",
                                                                fontWeight: "500"
                                                            }}
                                                            onClick={() => deleteEmployeeHandler(item._id)}
                                                        >
                                                            Delete
                                                        </button>

                                                    </td>

                                                </tr>
                                            ))

                                            :

                                            <tr>
                                                <td colSpan="9" className="text-center text-muted py-4">
                                                    No employees found
                                                </td>
                                            </tr>
                                    }

                                </tbody>

                            </table>
                        </div>
                    </div>

                    {/* PAGINATION */}
                    {employees.length > itemsPerPage && (
                        <div className="d-flex justify-content-center mt-4 p-4">

                            <nav>
                                <ul className="pagination">

                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage - 1)}
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
                                                onClick={() => handlePageChange(i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        </li>
                                    ))}

                                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage + 1)}
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


            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                onClick={(e) => e.stopPropagation()}
            >
                <h4 className="mb-3 text-center">
                    {
                        formType == "Edit" ? "Update Employee " : "Add Employee"
                    }
                </h4>


                {/* CLOSE ICON (TOP RIGHT) */}
                <button
                    type="button"
                    onClick={closeModal}
                    style={{
                        position: "absolute",
                        top: "12px",
                        right: "14px",
                        background: "#f1f1f1",
                        border: "none",
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        color: "#333",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                    }}
                >
                    ×
                </button>

                {/* FORM */}
                <form onSubmit={formType === "Edit" ? handleUpdate : handleSubmit}>
                    <div className="row g-3">

                        {/* NAME */}
                        <div className="col-md-6">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        {/* PHONE */}
                        <div className="col-md-6">
                            <label className="form-label">Phone</label>
                            <input
                                type="tel"
                                maxLength={10}
                                minLength={10}
                                className="form-control"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        {/* EMAIL + PASSWORD (ONLY ADD) */}
                        {formType === "Add" && (
                            <>
                                <div className="col-md-6">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {/* DESIGNATION */}
                        <div className="col-md-6">
                            <label className="form-label">Designation</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Engineer, Supervisor"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                            />
                        </div>

                        {/* DEPARTMENT */}
                        <div className="col-md-6">
                            <label className="form-label">Department</label>
                            <select
                                className="form-select"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                <option value="">Select Department</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* SALARY */}
                        <div className="col-md-6">
                            <label className="form-label">Salary</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter salary"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                            />
                        </div>

                        {/* ADDRESS */}
                        <div className="col-md-6">
                            <label className="form-label">Address</label>
                            <textarea
                                className="form-control"
                                rows="1"
                                placeholder="Enter address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            ></textarea>
                        </div>

                    </div>

                    {/* BUTTONS */}
                    <div className="d-flex gap-3 mt-4">
                        <button
                            type="button"
                            className="btn btn-outline-secondary w-50"
                            onClick={closeModal}
                            style={{ borderRadius: "10px" }}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-success w-50"
                            style={{ borderRadius: "10px", fontWeight: "500" }}
                        >
                            {formType === "Edit" ? "Update Employee" : "Add Employee"}
                        </button>
                    </div>
                </form>
            </Modal >
        </>
    )
}