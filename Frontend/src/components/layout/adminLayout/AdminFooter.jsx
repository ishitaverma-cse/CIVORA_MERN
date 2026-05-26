import { Link } from "react-router-dom";

export default function AdminFooter() {
    return (
        <>
            <footer
                id="footer"
                className="footer position-relative dark-background"
            >

                {/* FOOTER TOP */}
                <div className="footer-top">
                    <div className="container">
                        <div className="row gy-4">

                            {/* BRAND */}
                            <div className="col-lg-4 col-md-6 footer-about">

                                <div className="logo d-flex align-items-center">
                                    <span className="sitename">CIVORA</span>
                                </div>

                                <div className="footer-contact pt-3">

                                    <p>Smart Civic Issue Management Platform</p>
                                    <p>Punjab, India</p>

                                    <p className="mt-3">
                                        <strong>Email:</strong>
                                        <span> support@civora.gov.in</span>
                                    </p>

                                    <p>
                                        <strong>Phone:</strong>
                                        <span> +91 1800-123-4567</span>
                                    </p>

                                </div>
                            </div>

                            {/* QUICK LINKS */}
                            <div className="col-lg-2 col-md-3 footer-links">

                                <h4>Quick Links</h4>

                                <ul>
                                    <li><Link to="/admin/adminDashboard">Dashboard</Link></li>
                                    <li><Link to="/admin/employee">Employee</Link></li>
                                    <li><Link to="/admin/category">Category</Link></li>
                                    <li><Link to="/admin/users">Users</Link></li>
                                </ul>

                            </div>

                            {/* FEATURES */}
                            <div className="col-lg-3 col-md-3 footer-links">

                                <h4>Platform Features</h4>

                                <ul>
                                    <li><Link to="#">Report Civic Issues</Link></li>
                                    <li><Link to="#">Track Complaint Status</Link></li>
                                    <li><Link to="#">AI Severity Detection</Link></li>
                                    <li><Link to="#">Public Issue Dashboard</Link></li>
                                    <li><Link to="#">Admin Monitoring</Link></li>
                                </ul>

                            </div>

                            {/* SUPPORT */}
                            <div className="col-lg-3 col-md-3 footer-links">

                                <h4>Support</h4>

                                <ul>
                                    <li><Link to="#">Help Center</Link></li>
                                    <li><Link to="#">Privacy Policy</Link></li>
                                    <li><Link to="#">Terms & Conditions</Link></li>
                                    <li><Link to="#">Feedback</Link></li>
                                    <li><Link to="#">FAQs</Link></li>
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
                                © 2026
                                <strong>
                                    <span> CIVORA</span>
                                </strong>
                                . All Rights Reserved
                            </div>

                            <div className="credits">
                                Designed & Developed by <strong>Ishita Verma</strong>
                            </div>

                        </div>

                        {/* SOCIAL LINKS */}
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
    );
}