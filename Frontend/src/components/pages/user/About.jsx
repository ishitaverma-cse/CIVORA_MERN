import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function About() {
    const navigate = useNavigate();

    const isLoggedIn = () => {
        return localStorage.getItem("token");
    };

    // REPORT ISSUE
    const handleReportIssue = () => {
        const token = localStorage.getItem("token");

        if (!token) {

            Swal.fire({
                icon: "warning",
                title: "Login Required",
                text: "You need to login before reporting an issue.",
                showCancelButton: true,
                confirmButtonText: "Login",
                cancelButtonText: "Cancel",
            }).then((result) => {

                if (result.isConfirmed) {

                    //OPEN LOGIN MODAL
                    window.dispatchEvent(
                        new Event("openLoginModal")
                    );

                }
            });

            return;
        }
        navigate("/issues");
    };

    return (
        <>
            <main className="main">
                {/* Page Title */}
                <div className="page-title light-background">
                    <div className="container d-lg-flex justify-content-between align-items-center">
                        <h1 className="mb-2 mb-lg-0">About</h1>
                        <nav className="breadcrumbs">
                            <ol>
                                <li>
                                    <a href="/">Home</a>
                                </li>
                                <li className="current">About</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                {/* End Page Title */}

                {/* About Section */}
                <section id="about" className="about section">
                    <div className="container" data-aos="fade-up" data-aos-delay={100}>
                        <div className="row align-items-center">

                            {/* LEFT IMAGE */}
                            <div className="col-lg-5">
                                <div className="image-stack">
                                    <div
                                        className="main-image-wrapper"
                                        data-aos="fade-right"
                                        data-aos-delay={200}
                                    >
                                        <img
                                            src="/assets/img/city/city.jpg"
                                            alt="Smart City Overview"
                                            className="img-fluid main-image"
                                        />

                                        <div
                                            className="floating-card"
                                            data-aos="zoom-in"
                                            data-aos-delay={400}
                                        >
                                            <div className="card-icon">
                                                <i className="bi bi-building" />
                                            </div>
                                            <h6>Smart Civic Monitoring</h6>
                                            <p>Track & resolve city issues</p>
                                        </div>
                                    </div>
                                    <div
                                        className="secondary-image"
                                        data-aos="fade-up"
                                        data-aos-delay={300}
                                    >
                                        <img
                                            src="/assets/img/city/cityAbout2.jpg"
                                            alt="Luxury Suite"
                                            className="img-fluid"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT CONTENT */}
                            <div className="col-lg-7 p-5">
                                <div
                                    className="content-wrapper"
                                    data-aos="fade-left"
                                    data-aos-delay={200}
                                >
                                    <h2>Empowering Citizens Through Smart Governance</h2>
                                    <p className="lead">
                                        CIVORA is a digital platform designed to bridge the gap between citizens and authorities by enabling seamless issue reporting and real-time tracking.
                                    </p>
                                    <p>
                                        From potholes to public safety concerns, CIVORA ensures that every voice is heard and every issue is addressed efficiently using technology-driven solutions.
                                    </p>
                                    <div className="milestone-timeline">
                                        <div
                                            className="milestone-item"
                                            data-aos="slide-up"
                                            data-aos-delay={250}
                                        >
                                            <div className="milestone-year">2025</div>
                                            <div className="milestone-content">
                                                <h5>Project Initiation</h5>
                                                <p>Idea conceptualized to solve civic issues digitally</p>
                                            </div>
                                        </div>
                                        <div
                                            className="milestone-item"
                                            data-aos="slide-up"
                                            data-aos-delay={300}
                                        >
                                            <div className="milestone-year">2026</div>
                                            <div className="milestone-content">
                                                <h5>Development Phase</h5>
                                                <p>Frontend and backend development using MERN stack</p>
                                            </div>
                                        </div>
                                        <div
                                            className="milestone-item"
                                            data-aos="slide-up"
                                            data-aos-delay={350}
                                        >
                                            <div className="milestone-year">2026</div>
                                            <div className="milestone-content">
                                                <h5>Deployment & Testing</h5>
                                                <p>Platform tested and prepared for real-world usage</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ACTION BUTTONS */}
                                    <div className="action-buttons">

                                        <button
                                            className="btn-explore"
                                            onClick={handleReportIssue}
                                        >
                                            <i className="bi bi-plus-circle" />
                                            Report an Issue
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
                {/* /About Section */}
            </main>
        </>
    )
}