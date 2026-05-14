import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminHeader() {

    let nav = useNavigate()
    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("isLogin");
        localStorage.removeItem("token");
        toast.success("Logout Success");
        nav("/");
        
        setTimeout(() => {
            window.dispatchEvent(
                new Event("openLoginModal")
            );
        }, 100);
    }
    return (
        <>
            <header id="header" className="header sticky-top">
                {/* <div className="topbar d-flex align-items-center dark-background">
                    <div className="container d-flex justify-content-center justify-content-md-between">
                        <div className="contact-info d-flex align-items-center">
                            <i className="bi bi-envelope d-flex align-items-center">
                                <Link to="mailto:contact@example.com">contact@example.com</Link>
                            </i>
                            <i className="bi bi-phone d-flex align-items-center ms-4">
                                <span>+1 5589 55488 55</span>
                            </i>
                        </div>
                        <div className="social-links d-none d-md-flex align-items-center">
                            <Link to="#" className="twitter">
                                <i className="bi bi-twitter-x" />
                            </Link>
                            <Link to="#" className="facebook">
                                <i className="bi bi-facebook" />
                            </Link>
                            <Link to="#" className="instagram">
                                <i className="bi bi-instagram" />
                            </Link>
                            <Link to="#" className="linkedin">
                                <i className="bi bi-linkedin" />
                            </Link>
                        </div>
                    </div>
                </div> */}
                {/* End Top Bar */}
                <div className="branding d-flex align-items-center">
                    <div className="container position-relative d-flex align-items-center justify-content-between">
                        <div className="logo d-flex align-items-center">
                            {/* Uncomment the line below if you also wish to use an image logo */}
                            {/* <img src="assets/img/logo.webp" alt=""> */}
                            <h1 className="sitename">CIVORA</h1>
                        </div>
                        <nav id="navmenu" className="navmenu">
                            <ul>
                                <li>
                                    <Link to="/admin/adminDashboard" className="active">
                                        Dashboard
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/admin/employee" className="active">
                                        Employee
                                    </Link>
                                </li>


                                <li>
                                    <Link to="/admin/category" className="active">
                                        Category
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/admin/issues" className="active">
                                        Issues
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/admin/assignments" className="active">
                                        Assignments
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/admin/users" className="active">
                                        Users
                                    </Link>
                                </li>



                                <li className="navmenu ms-2">
                                    <button onClick={logout} className="btn btn-subtle-success borfer border-dark text-white rounded-3 px-4 shadow" >
                                        <i class="bi bi-door-open me-2"></i>
                                        Logout
                                    </button>
                                </li>

                            </ul>
                            <i className="mobile-nav-toggle d-xl-none bi bi-list" />
                        </nav>
                    </div>
                </div>
            </header>


        </>
    )
}