import { Link } from "react-router-dom";

export default function UserFooter() {
    return (
        <>
            <footer id="footer" className="footer position-relative dark-background">

                {/* FOOTER TOP */}
                <div className="footer-top">
                    <div className="container">

                        <div className="row gy-4">

                            {/* ABOUT */}
                            <div className="col-lg-4 col-md-6 footer-about">

                                <div className="logo d-flex align-items-center">
                                    <span className="sitename">CIVORA</span>
                                </div>

                                <div className="footer-contact pt-3">
                                    <p>Smart Civic Issue Management Platform</p>
                                    <p>Punjab, India</p>

                                    <p className="mt-3">
                                        <strong>Phone:</strong>
                                        <span> +91 1800-123-4567</span>
                                    </p>

                                    <p>
                                        <strong>Email:</strong>
                                        <span> support@civora.gov.in</span>
                                    </p>
                                </div>

                            </div>

                            {/* QUICK LINKS */}
                            <div className="col-lg-2 col-md-3 footer-links">

                                <h4>Quick Links</h4>

                                <ul>
                                    <li>
                                        <Link to="/">
                                            Home
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/issues">
                                            My Issues
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/issues">
                                            Public Issues
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/contact">
                                            Contact
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="#"
                                            onClick={(e) => {
                                                e.preventDefault();

                                                localStorage.removeItem("isLogin");
                                                localStorage.removeItem("token");
                                                localStorage.removeItem("userId");

                                                window.location.href = "/";
                                            }}
                                        >
                                            Logout
                                        </Link>
                                    </li>
                                </ul>

                            </div>

                            {/* FEATURES */}
                            <div className="col-lg-3 col-md-3 footer-links">

                                <h4>Platform Features</h4>

                                <ul>
                                    <li>
                                        <Link to="#">
                                            AI Severity Detection
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="#">
                                            Real-Time Tracking
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="#">
                                            Complaint Management
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="#">
                                            Smart Notifications
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="#">
                                            Public Transparency
                                        </Link>
                                    </li>
                                </ul>

                            </div>

                            {/* SUPPORT */}
                            <div className="col-lg-3 col-md-3 footer-links">

                                <h4>Support</h4>

                                <ul>
                                    <li>
                                        <Link to="#">
                                            Help Center
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="#">
                                            Contact Support
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="#">
                                            FAQs
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="#">
                                            Privacy Policy
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="#">
                                            Terms & Conditions
                                        </Link>
                                    </li>
                                </ul>

                            </div>

                        </div>

                    </div>
                </div>

                {/* COPYRIGHT */}
                <div className="copyright text-center">

                    <div className="container d-flex flex-column flex-lg-row justify-content-center justify-content-lg-between align-items-center">

                        <div className="d-flex flex-column align-items-center align-items-lg-start">

                            <div>
                                © Copyright{" "}
                                <strong>
                                    <span>CIVORA</span>
                                </strong>
                                . All Rights Reserved
                            </div>

                            <div className="credits">
                                Designed & Developed by <strong>Ishita Verma</strong>
                            </div>

                        </div>

                        {/* SOCIAL ICONS */}
                        <div className="social-links order-first order-lg-last mb-3 mb-lg-0">

                            <Link to="">
                                <i className="bi bi-twitter-x" />
                            </Link>

                            <Link to="">
                                <i className="bi bi-facebook" />
                            </Link>

                            <Link to="">
                                <i className="bi bi-instagram" />
                            </Link>

                            <Link to="">
                                <i className="bi bi-linkedin" />
                            </Link>

                        </div>

                    </div>

                </div>

            </footer>
        </>
    )
}