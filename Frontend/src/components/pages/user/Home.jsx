import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem("user"));
        setUser(u);
    }, []);

    const slides = [
        {
            img: "/assets/img/city/home_city.avif",
            title: "SMART CITY MANAGEMENT",
            subtitle: "Transforming urban living with intelligent governance systems."
        },
        {
            img: "/assets/img/city/home_city.jpg",
            title: "SEAMLESS CIVIC CONTROL",
            subtitle: "Report, track and resolve issues in real-time with transparency."
        },
        {
            img: "/assets/img/city/home_city3.jpg",
            title: "FUTURE READY PLATFORM",
            subtitle: "A unified ecosystem for citizens, employees & administrators."
        }
    ];

    return (
        <div className="landing-container">

            {/* HERO CAROUSEL */}
            <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">

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
                        <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>

                            <div
                                className="hero-slide"
                                style={{ backgroundImage: `url(${slide.img})` }}
                            />

                            <div className="hero-overlay" />

                            {/* HERO CONTENT */}
                            <div className="carousel-caption custom-caption">

                                <span className="badge-glow rounded-2">CIVORA PLATFORM</span>

                                <h1 className="hero-title">
                                    {slide.title}
                                </h1>

                                <p className="hero-subtitle">
                                    {slide.subtitle}
                                </p>

                                <div className="cta-group">
                                    <Link to="/issues" className="btn btn-primary me-3">
                                        View Issues
                                    </Link>

                                    <Link to="/login" className="btn btn-outline-light">
                                        Get Started
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

                {/* Controls */}
                <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" />
                </button>

                <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" />
                </button>
            </div>


            {/* FEATURES SECTION (kept below hero) */}
            <section className="features-section">
                <div className="section-header">
                    <h2>OUR SERVICES</h2>
                    <p>Everything you need to manage civic issues efficiently and transparently.</p>
                </div>

                <div className="card-grid">
                    <div className="feature-card">
                        <h3>Complaints</h3>
                        <p>Submit and track civic issues in real-time.</p>
                    </div>

                    <div className="feature-card">
                        <h3>Employees</h3>
                        <p>Manage workforce assignments and performance.</p>
                    </div>

                    <div className="feature-card">
                        <h3>Analytics</h3>
                        <p>Visual dashboards for complete system insights.</p>
                    </div>
                </div>
            </section>

        </div>
    );
}