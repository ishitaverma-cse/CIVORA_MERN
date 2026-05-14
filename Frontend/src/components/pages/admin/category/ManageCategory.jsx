import Modal from "react-modal";
import { useEffect, useState } from "react";
import { addCategory, allCategory, singleCategory, updateCategory, deleteCategory } from "../../../../services/CategoryService";
import { toast } from "react-toastify";
import Switch from "react-switch";
import Swal from "sweetalert2";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        height: '400px',
        padding: '40px',
        borderRadius: '30px',
        overflow: 'auto'
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 9999
    }
};

export default function ManageCategory() {

    const [name, setName] = useState("");
    const [formType, setFormType] = useState("");
    const [description, setDescription] = useState("");

    const [selectedId, setSelectedId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;


    // OPEN / CLOSE
    function openModal(type, _id) {
        setFormType(type);
        setSelectedId(_id);

        if (type === "Edit") {
            getSingleCategory(_id);
        }

        setIsOpen(true);
    }

    function closeModal() {
        fetchCategories();
        setIsOpen(false);
        setName("");
        setDescription("");
        setSelectedId(null);
        setFormType("");
    }

    const getSingleCategory = async (id) => {
        try {
            let res = await singleCategory({ _id: id });

            if (res.data.success) {
                setName(res.data.data.name);
                setDescription(res.data.data.description);
            }

        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formData = {
            name: name,
            description: description
        };

        if (formType === "Add") {
            let res = await addCategory(formData);

            if (res.data.success) {
                toast.success(res.data.message);
                closeModal();
                onSuccess();
            } else {
                toast.error(res.data.message);
            }
        }

        else if (formType === "Edit") {
            formData._id = selectedId;

            let res = await updateCategory(formData);

            if (res.data.success) {
                toast.success(res.data.message);
                closeModal();
                onSuccess();
            } else {
                toast.error(res.data.message);
            }
        }
    };

    async function fetchCategories() {
        try {
            const res = await allCategory();

            if (res?.data?.success) {
                setCategories(res.data.data);
            }

        } catch (err) {
            console.log("fetchCategories error:", err);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    // DELETE 
    const deleteCat = async (id) => {

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This category will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        // stop if user cancels
        if (!result.isConfirmed) return;

        try {
            const res = await deleteCategory({ _id: id });

            if (res.data.success) {

                Swal.fire("Deleted!", res.data.message, "success");

                // instant UI update
                setCategories(prev =>
                    prev.filter(cat => cat._id !== id)
                );

            } else {
                Swal.fire("Error!", res.data.message, "error");
            }

        } catch (err) {
            console.log(err);
            Swal.fire("Error!", "Something went wrong", "error");
        }
    };

    // SWITCH 
    const toggleStatus = async (id, currentStatus) => {

        const newStatus = currentStatus === true || currentStatus === "true"
            ? false
            : true;

        let data1 = { _id: id, status: newStatus };

        await updateCategory(data1);
        setCategories(prev =>
            prev.map(c =>
                c._id === id ? { ...c, status: newStatus } : c
            )
        );
    };

    //PAGINATION
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(categories.length / itemsPerPage);

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
                        <h1 className="mb-2 mb-lg-0">Category</h1>
                        <nav className="breadcrumbs">
                            <ol>
                                <li>
                                    <a href="/admin/adminDashboard">Dashboard</a>
                                </li>
                                <li className="current">Category</li>
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
                                    Manage Category
                                </h2>
                                <p className="text-muted mb-0">
                                    Add, update and manage system categories
                                </p>
                            </div>

                            <button
                                className="btn rounded-pill px-4 py-2"
                                style={{
                                    background: "#29443a",
                                    color: "#fff",
                                    fontWeight: "500"
                                }}
                                onClick={() => {
                                    setFormType("Add");
                                    openModal("Add", null);
                                }}
                            >
                                + Add New Category
                            </button>

                        </div>
                    </div>

                    {/* TABLE CARD */}
                    <div
                        className="card border-0 shadow-sm rounded-5 p-4"
                        style={{ background: "#ffffff" }}
                    >

                        <div className="mb-3">
                            <h5 className="fw-bold mb-0" style={{ color: "#29443a" }}>
                                Category List
                            </h5>
                        </div>

                        <div className="table-responsive">

                            <table className="table align-middle">

                                <thead>
                                    <tr style={{ color: "#29443a" }}>
                                        <th>#</th>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th className="text-center">Status</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {
                                        currentCategories.length > 0 ?

                                            currentCategories.map((item, index) => (
                                                <tr key={item._id || index}>

                                                    <td className="fw-semibold">
                                                        {indexOfFirstItem + index + 1}
                                                    </td>

                                                    <td className="fw-semibold">
                                                        {item.name}
                                                    </td>

                                                    <td className="ellipsis text-muted" title={item.description}>
                                                        {item.description}
                                                    </td>

                                                    {/* STATUS */}
                                                    <td className="text-center">
                                                        <Switch
                                                            checked={
                                                                item.status === true ||
                                                                item.status === "true"
                                                            }
                                                            onChange={() =>
                                                                toggleStatus(item._id, item.status)
                                                            }
                                                            onColor="#198754"
                                                            offColor="#6c757d"
                                                            height={20}
                                                            width={40}
                                                        />
                                                    </td>

                                                    {/* ACTIONS */}
                                                    <td className="text-center">

                                                        <button
                                                            className="btn btn-sm rounded-pill px-3 me-2"
                                                            style={{
                                                                background: "#edf3ff",
                                                                color: "#3559b7",
                                                                fontWeight: "500"
                                                            }}
                                                            onClick={() => {
                                                                setFormType("Edit");
                                                                openModal("Edit", item._id);
                                                            }}
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
                                                            onClick={() => deleteCat(item._id)}
                                                        >
                                                            Delete
                                                        </button>

                                                    </td>

                                                </tr>
                                            ))

                                            :

                                            <tr>
                                                <td colSpan="5" className="text-center text-muted py-4">
                                                    No categories found
                                                </td>
                                            </tr>
                                    }

                                </tbody>

                            </table>

                        </div>
                    </div>
                    {/* PAGINATION */}
                    {categories.length > itemsPerPage && (
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

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
            >
                <h4 className="mb-3 text-center">
                    {
                        formType == "Add" ? "Add Category " : "Update Category"
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
                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="mb-3">
                        <label className="form-label">Category Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Enter category name"
                            value={name}

                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />
                    </div>
                    {/* Description */}
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            className="form-control"
                            rows="3"
                            placeholder="Enter description"
                            value={description}

                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        ></textarea>
                    </div>
                    {/* Buttons */}
                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary w-50"
                            onClick={closeModal}
                        >
                            Close
                        </button>

                        <button
                            type="submit"
                            className="btn btn-success w-50"
                            onClick={() => updateCat(item._id)}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}