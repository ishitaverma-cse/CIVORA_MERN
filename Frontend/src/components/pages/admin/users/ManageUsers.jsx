import { Component, useEffect, useState } from "react";
import Switch from "react-switch";
import { allCitizen, blockUser } from "../../../../services/userService";
import { toast } from "react-toastify";
import Modal from "react-modal";
import Loader from "../../../common/Loader";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '30%',
        height: '340px',
        padding: '40px',
        borderRadius: '30px',
        overflow: 'auto'
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 9999
    }
};
export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [blockModalOpen, setBlockModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // FETCH USERS
    const fetchUsers = async () => {
        try {
            const res = await allCitizen();

            if (res.data.success) {
                setUsers(res.data.data);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to load users");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);


    // TOGGLE SWITCH 
    class MaterialDesignSwitch extends Component {
        constructor() {
            super();
            this.state = { checked: false };
            this.handleChange = this.handleChange.bind(this);
        }
    }

    //HANDLE TOGGLE ~ decides WHAT to do
    const handleToggle = (user) => {
        console.log("TOGGLE CLICKED:", user);


        // BLOCK → open modal only
        if (!user.isBlocked) {
            setSelectedUser(user);
            setBlockModalOpen(true);
            console.log("Opening modal...");
        } else {
            // UNBLOCK → direct API call
            handleUnblock(user);
        }
    };

    //HANDLES BLOCK (submit button from modal)
    const submitBlock = async (e) => {
        e.preventDefault();

        if (!reason) {
            toast.error("Reason is required");
            return;
        }

        try {
            const res = await blockUser({
                userId: selectedUser._id,
                reason
            });

            if (res.data.success) {
                toast.success("User blocked");

                setUsers(prev =>
                    prev.map(u =>
                        u._id === selectedUser._id
                            ? { ...u, isBlocked: true }
                            : u
                    )
                );

                closeBlockModal();
            }
        } catch (err) {
            console.log(err);
        }
    };

    // HANDLE UNBLOCK
    const handleUnblock = async (user) => {
        try {
            const res = await blockUser({ userId: user._id });

            if (res.data.success) {
                toast.success("User unblocked");

                setUsers(prev =>
                    prev.map(u =>
                        u._id === user._id
                            ? { ...u, isBlocked: false }
                            : u
                    )
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const closeBlockModal = () => {
        setBlockModalOpen(false);
        setReason("");
        setSelectedUser(null);
    };

    //PAGINATION
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(users.length / itemsPerPage);

    return (
        <>
            <section
                id="users-panel"
                className="section"
                style={{
                    background: "#e6eef8",
                    minHeight: "100vh"
                }}
            >

                {/* KEEP SECTION TITLE EXACTLY SAME */}
                <div className="page-title light-background">
                    <div className="container d-lg-flex justify-content-between align-items-center">
                        <h1 className="mb-2 mb-lg-0">Users</h1>
                        <nav className="breadcrumbs">
                            <ol>
                                <li>
                                    <a href="/admin/adminDashboard">Dashboard</a>
                                </li>
                                <li className="current">Users</li>
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
                                    Manage Users
                                </h2>
                                <p className="text-muted mb-0">
                                    View and control user access & activity
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
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Complaints</th>
                                        <th>Status</th>
                                        <th>Block User</th>
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
                                                            style={{ width: "20px", height: "20px" }}
                                                        ></div>
                                                    </td>

                                                    {/* NAME */}
                                                    <td>
                                                        <div
                                                            className="skeleton mx-auto"
                                                            style={{ width: "140px", height: "20px" }}
                                                        ></div>
                                                    </td>

                                                    {/* EMAIL */}
                                                    <td>
                                                        <div
                                                            className="skeleton mx-auto"
                                                            style={{ width: "200px", height: "20px" }}
                                                        ></div>
                                                    </td>

                                                    {/* COMPLAINTS */}
                                                    <td>
                                                        <div
                                                            className="skeleton mx-auto"
                                                            style={{ width: "40px", height: "20px" }}
                                                        ></div>
                                                    </td>

                                                    {/* STATUS */}
                                                    <td>
                                                        <div
                                                            className="skeleton mx-auto"
                                                            style={{
                                                                width: "80px",
                                                                height: "25px",
                                                                borderRadius: "20px"
                                                            }}
                                                        ></div>
                                                    </td>

                                                    {/* SWITCH */}
                                                    <td>
                                                        <div className="d-flex justify-content-center">
                                                            <div
                                                                className="skeleton"
                                                                style={{
                                                                    width: "45px",
                                                                    height: "20px",
                                                                    borderRadius: "20px"
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </td>

                                                </tr>
                                            ))

                                            :

                                            currentUsers.length > 0 ?

                                                currentUsers.map((user, index) => (
                                                    <tr key={user._id || index}>

                                                        {/* INDEX */}
                                                        <td className="fw-semibold">
                                                            {indexOfFirstItem + index + 1}
                                                        </td>

                                                        {/* NAME */}
                                                        <td className="fw-semibold">
                                                            {user.name}
                                                        </td>

                                                        {/* EMAIL */}
                                                        <td>
                                                            {user.email}
                                                        </td>

                                                        {/* COMPLAINTS */}
                                                        <td className="fw-semibold text-primary">
                                                            {user.complaintCount || 0}
                                                        </td>

                                                        {/* STATUS */}
                                                        <td>
                                                            <span
                                                                className={`badge rounded-pill px-3 py-2 ${user.isBlocked
                                                                    ? "bg-danger"
                                                                    : "bg-success"
                                                                    }`}
                                                            >
                                                                {user.isBlocked ? "Blocked" : "Active"}
                                                            </span>
                                                        </td>

                                                        {/* SWITCH */}
                                                        <td>
                                                            <Switch
                                                                checked={!user.isBlocked}
                                                                onChange={() => handleToggle(user)}
                                                                onColor="#86d3ff"
                                                                onHandleColor="#2693e6"
                                                                handleDiameter={22}
                                                                uncheckedIcon={false}
                                                                checkedIcon={false}
                                                                height={18}
                                                                width={42}
                                                            />
                                                        </td>

                                                    </tr>
                                                ))

                                                :

                                                <tr>
                                                    <td colSpan="6" className="text-center text-muted py-4">
                                                        No users found
                                                    </td>
                                                </tr>
                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>
                    {/* PAGINATION */}
                    {users.length > itemsPerPage && (
                        <div className="d-flex justify-content-center mt-4">

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

            <Modal
                isOpen={blockModalOpen}
                onRequestClose={closeBlockModal}
                style={customStyles}
            >

                <form onSubmit={submitBlock}>

                    {/* USER INFO */}
                    <div className="mb-2 text-center p-3">
                        <h4 className="mb-3 text-center fs-3"> Block User: {selectedUser?.name}</h4>
                    </div>

                    {/* REASON FIELD */}
                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Enter reason..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        />
                    </div>

                    {/* BUTTONS */}
                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary w-50"
                            onClick={closeBlockModal}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-danger w-50"
                        >
                            Block User
                        </button>
                    </div>

                </form>
            </Modal>
        </>
    )
}