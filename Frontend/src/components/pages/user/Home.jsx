import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { homeStats } from "../../../services/userService";

export default function Home() {

    const [stats, setStats] = useState({
        totalIssues: 0,
        resolvedIssues: 0,
        activeCitizens: 0,
        departments: 0
    });

    async function fetchHomeStats() {
        try {
            let res = await homeStats();
            if (res.data.success) {
                setStats(res.data.data);
            }
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        fetchHomeStats();
    }, []);

    const slides = [
        {
            img: "/assets/img/city/home_city.avif",
            title: "SMART CITY MANAGEMENT",
            subtitle: "Transforming urban living with intelligent governance systems."
        },
        {
            img: "/assets/img/city/home_city_2.jpg",
            title: "SEAMLESS CIVIC CONTROL",
            subtitle: "Report, track and resolve issues in real-time with transparency."
        },
    ];

    return (
        <div className="landing-container">

            {/* HERO CAROUSEL */}
            <div
                id="heroCarousel"
                className="carousel slide carousel-fade"
                data-bs-ride="carousel"
            >

                {/* Indicators */}
                <div className="carousel-indicators">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            data-bs-target="#heroCarousel"
                            data-bs-slide-to={i}
                            className={i === 0 ? "active" : ""}
                        />
                    ))}
                </div>

                {/* Slides */}
                <div className="carousel-inner">

                    {slides.map((slide, i) => (
                        <div
                            key={i}
                            className={`carousel-item ${i === 0 ? "active" : ""}`}
                        >

                            <div
                                className="hero-slide"
                                style={{
                                    backgroundImage: `url(${slide.img})`
                                }}
                            />

                            <div className="hero-overlay" />

                            {/* HERO CONTENT */}
                            <div className="carousel-caption custom-caption">

                                <span className="badge-glow rounded-2">
                                    CIVORA PLATFORM
                                </span>

                                <h1 className="hero-title">
                                    {slide.title}
                                </h1>

                                <p className="hero-subtitle">
                                    {slide.subtitle}
                                </p>

                                <div className="cta-group">

                                    <Link
                                        to="/issues"
                                        className="btn btn-primary me-3"
                                    >
                                        View Issues
                                    </Link>

                                    <Link
                                        to="/login"
                                        className="btn btn-outline-light"
                                    >
                                        Get Started
                                    </Link>

                                </div>

                            </div>

                        </div>
                    ))}

                </div>

                {/* Controls */}
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#heroCarousel"
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" />
                </button>

                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#heroCarousel"
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" />
                </button>

            </div>

            {/* ================= LIVE CITY STATS ================= */}
            <section className="city-stats-section">
                <div className="container">
                    <div className="section-title text-center">
                        <span>
                            LIVE PLATFORM INSIGHTS
                        </span>
                        <h2>
                            Real-Time Civic Intelligence
                        </h2>
                        <p>
                            Track issue resolution, citizen engagement,
                            and smart city operations through the CIVORA platform.
                        </p>
                    </div>

                    <div className="stats-grid">
                        {/* CARD 1 */}
                        <div className="stat-card">

                            <div className="stat-icon">
                                <i className="bi bi-megaphone-fill"></i>
                            </div>

                            <h3>{stats.totalIssues}+</h3>
                            <p>Total Issues Reported</p>

                        </div>

                        {/* CARD 2 */}
                        <div className="stat-card">

                            <div className="stat-icon">
                                <i className="bi bi-check-circle-fill"></i>
                            </div>

                            <h3>{stats.resolvedIssues}+</h3>
                            <p>Resolved Complaints</p>

                        </div>

                        {/* CARD 3 */}
                        <div className="stat-card">

                            <div className="stat-icon">
                                <i className="bi bi-people-fill"></i>
                            </div>

                            <h3>{stats.activeCitizens}+</h3>
                            <p>Active Citizens</p>

                        </div>

                        {/* CARD 4 */}
                        <div className="stat-card">

                            <div className="stat-icon">
                                <i className="bi bi-building-fill-check"></i>
                            </div>

                            <h3>{stats.departments}</h3>
                            <p>Municipal Departments</p>

                        </div>

                    </div>

                </div>

            </section>

            {/* ================= DEPARTMENTS SHOWCASE ================= */}
            <section className="departments-section">

                <div className="container-fluid px-lg-5">

                    {/* HEADER */}
                    <div className="department-heading text-center">

                        <span className="department-badge">
                            MUNICIPAL NETWORK
                        </span>

                        <h2>
                            Integrated Civic Departments
                        </h2>

                        <p>
                            CIVORA intelligently connects multiple city departments
                            into one seamless governance ecosystem for faster issue
                            resolution and operational transparency.
                        </p>

                    </div>

                    {/* MASONRY GRID */}
                    <div className="department-grid">

                        {/* LARGE CARD */}
                        <div className="department-card extra-large-card">

                            <img
                                src="/assets/img/department/road_maintenance.jpg"
                                alt="Road Maintenance"
                            />

                            <div className="department-overlay">

                                <span>
                                    Infrastructure Division
                                </span>

                                <h3>
                                    Road Maintenance
                                </h3>

                            </div>

                        </div>

                        {/* CARD */}
                        <div className="department-card">

                            <img
                                src="/assets/img/department/waste_management.jpg"
                                alt="Waste Management"
                            />

                            <div className="department-overlay">

                                <span>
                                    Sanitation Department
                                </span>

                                <h3>
                                    Waste Management
                                </h3>

                            </div>

                        </div>

                        {/* CARD */}
                        <div className="department-card ">

                            <img
                                src="/assets/img/department/water_supply.jpg"
                                alt="Water Supply"
                            />

                            <div className="department-overlay">

                                <span>
                                    Urban Utilities
                                </span>

                                <h3>
                                    Water Supply
                                </h3>

                            </div>

                        </div>

                        {/* WIDE CARD */}
                        <div className="department-card tall-card">

                            <img
                                src="/assets/img/department/street_light.jpg"
                                alt="Street Lighting"
                            />

                            <div className="department-overlay">

                                <span>
                                    Electrical Division
                                </span>

                                <h3>
                                    Smart Street Lighting
                                </h3>

                            </div>

                        </div>

                        {/* CARD */}
                        <div className="department-card large-card">
                            <img
                                src="/assets/img/department/traffic.jpg"
                                alt="Traffic Management"
                            />

                            <div className="department-overlay">

                                <span>
                                    Mobility Control
                                </span>

                                <h3>
                                    Traffic Congestion
                                </h3>

                            </div>

                        </div>

                        {/* WIDE CARD */}
                        <div className="department-card tall-card infrastructure-card">
                            <img
                                src="/assets/img/department/urban_infrastructure.jpg"
                                alt="Urban Infrastructure"
                            />

                            <div className="department-overlay">

                                <span>
                                    Public Works Division
                                </span>

                                <h3>
                                    Urban Infrastructure
                                </h3>

                            </div>
                        </div>

                        
                    </div>

                </div>

            </section>

            {/* ================= HOW CIVORA WORKS ================= */}
            <section className="civora-flow-section">
                <div className="container-fluid px-lg-5">

                    {/* HEADING */}
                    <div className="flow-heading text-center">
                        <span className="flow-badge">
                            HOW IT WORKS
                        </span>

                        <h2>
                            A Smarter Way To Manage Civic Issues
                        </h2>

                        <p>
                            CIVORA connects citizens, municipal departments and field
                            employees through a seamless digital governance ecosystem.
                        </p>

                    </div>

                    {/* ROW 1 */}
                    <div className="flow-row">

                        {/* IMAGE */}
                        <div className="flow-image">
                            <img
                                src="/assets/img/city/report_issue.jpg"
                                alt="Report Issue"
                            />
                        </div>

                        {/* CONTENT */}
                        <div className="flow-content">
                            <span className="flow-step">
                                STEP 01
                            </span>

                            <h3>
                                Report Civic Problems Instantly
                            </h3>

                            <p>
                                Citizens can easily report potholes, garbage,
                                water leakage, damaged roads and infrastructure
                                problems using images, location and descriptions.
                            </p>

                            <div className="flow-points">

                                <div>
                                    <i className="bi bi-check-circle-fill"></i>
                                    Upload issue photos instantly
                                </div>

                                <div>
                                    <i className="bi bi-check-circle-fill"></i>
                                    Real-time location tracking
                                </div>

                                <div>
                                    <i className="bi bi-check-circle-fill"></i>
                                    Fast and transparent reporting
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ROW 2 */}
                    <div className="flow-row reverse-flow">

                        {/* IMAGE */}
                        <div className="flow-image">
                            <img
                                src="/assets/img/city/smart_assignment.jpg"
                                alt="Assignment"
                            />
                        </div>

                        {/* CONTENT */}
                        <div className="flow-content">
                            <span className="flow-step">
                                STEP 02
                            </span>

                            <h3>
                                Smart Department Assignment
                            </h3>

                            <p>
                                CIVORA intelligently routes complaints to the
                                correct municipal departments and employees
                                for quick response and efficient handling.
                            </p>

                            <div className="flow-points">

                                <div>
                                    <i className="bi bi-check-circle-fill"></i>
                                    Automated workflow system
                                </div>

                                <div>
                                    <i className="bi bi-check-circle-fill"></i>
                                    Faster complaint allocation
                                </div>

                                <div>
                                    <i className="bi bi-check-circle-fill"></i>
                                    Reduced manual delays
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ROW 3 */}
                    <div className="flow-row">

                        {/* IMAGE */}
                        <div className="flow-image">
                            <img
                                src="/assets/img/city/track_progress.jpg"
                                alt="Track Progress"
                            />
                        </div>

                        {/* CONTENT */}
                        <div className="flow-content">
                            <span className="flow-step">
                                STEP 03
                            </span>

                            <h3>
                                Track Resolution Progress Live
                            </h3>

                            <p>
                                Citizens receive real-time updates regarding
                                complaint progress, employee actions and final
                                issue resolution directly through the platform.
                            </p>

                            <div className="flow-points">

                                <div>
                                    <i className="bi bi-check-circle-fill"></i>
                                    Live complaint status updates
                                </div>

                                <div>
                                    <i className="bi bi-check-circle-fill"></i>
                                    Improved accountability
                                </div>

                                <div>
                                    <i className="bi bi-check-circle-fill"></i>
                                    Better citizen engagement
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}