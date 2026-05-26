import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { homeStats } from "../../../services/userService";
import { sendChat } from "../../../services/ChatService";

export default function Home() {

    const [stats, setStats] = useState({
        totalIssues: 0,
        resolvedIssues: 0,
        activeCitizens: 0,
        departments: 0
    });

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);

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

    //SEND MSG
    const sendMessage = async () => {
        if (!message.trim()) return;

        const userMsg = message;
        setMessage("");

        setChat(prev => [...prev, { role: "user", text: userMsg }]);
        setLoading(true);

        try {
            const res = await sendChat(userMsg);

            setChat(prev => [
                ...prev,
                { role: "bot", text: res.data.reply }
            ]);
        } catch (err) {
            setChat(prev => [
                ...prev,
                { role: "bot", text: "AI error occurred" }
            ]);
        }
        setLoading(false);
    };

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


                                <Link
                                    to="/issues"
                                    className="btn btn-primary ms-5"
                                >
                                    <div>
                                        Start Reporting
                                    </div>
                                </Link>


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

            {/* ================= FUTURISTIC CITY PROBLEMS ================= */}
<section className="city-flow-section">
    <div className="min-vh-100 py-5" style={{ background: "#f8f9fa" }}>
        <div className="container-fluid px-lg-5">

            {/* HEADING */}
            <div className="flow-heading text-center mb-5">
                <span className="flow-badge">CITY REALITY CHECK</span>
                <h2>When Cities Start Breaking in Real Time</h2>
                <p>
                    Modern cities face invisible failures every day — flooding, traffic collapse,
                    and pollution spikes. CIVORA detects and resolves them faster.
                </p>
            </div>

            {/* ================= ROW 1 ================= */}
            <div className="flow-row d-flex flex-wrap align-items-center mb-5">

                {/* IMAGE LEFT */}
                <div className="flow-image col-md-6">
                    <img
                        src="/assets/img/city/flood_city.jpg"
                        alt="Urban Flooding"
                        className="img-fluid rounded-4 shadow"
                    />
                </div>

                {/* TEXT RIGHT */}
                <div className="flow-content col-md-6 p-4">
                    <span className="flow-step">CRISIS 01</span>
                    <h3>Sudden Urban Flooding Events</h3>
                    <p>
                        Extreme rainfall overwhelms drainage systems within minutes,
                        causing transport collapse and property damage in smart cities.
                    </p>
                    <div className="flow-points">
                        <div>⚠️ Real-time water level spikes</div>
                        <div>⚠️ Blocked drainage detection</div>
                        <div>⚠️ Emergency response delay reduction</div>
                    </div>
                </div>
            </div>

            {/* ================= ROW 2 ================= */}
            <div className="flow-row d-flex flex-wrap align-items-center mb-5 flex-md-row-reverse">

                {/* IMAGE RIGHT */}
                <div className="flow-image col-md-6">
                    <img
                        src="/assets/img/city/traffic_ai.jpg"
                        alt="AI Traffic Gridlock"
                        className="img-fluid rounded-4 shadow"
                    />
                </div>

                {/* TEXT LEFT */}
                <div className="flow-content col-md-6 p-4">
                    <span className="flow-step">CRISIS 02</span>
                    <h3>AI-Controlled Traffic Gridlocks</h3>
                    <p>
                        Even intelligent traffic systems fail during peak overload,
                        creating cascading congestion across entire city zones.
                    </p>
                    <div className="flow-points">
                        <div>🚦 Signal synchronization failure</div>
                        <div>🚦 Emergency route blockage</div>
                        <div>🚦 Dynamic rerouting required</div>
                    </div>
                </div>
            </div>

            {/* ================= ROW 3 ================= */}
            <div className="flow-row d-flex flex-wrap align-items-center">

                {/* IMAGE LEFT */}
                <div className="flow-image col-md-6">
                    <img
                        src="/assets/img/city/pollution_future.jpg"
                        alt="City Pollution Dome"
                        className="img-fluid rounded-4 shadow"
                    />
                </div>

                {/* TEXT RIGHT */}
                <div className="flow-content col-md-6 p-4">
                    <span className="flow-step">CRISIS 03</span>
                    <h3>Invisible Air Pollution Surges</h3>
                    <p>
                        Toxic air pockets form unexpectedly in dense zones,
                        affecting thousands before sensors even react.
                    </p>
                    <div className="flow-points">
                        <div>🌫️ AQI spikes in real time</div>
                        <div>🌫️ Health risk alerts delayed</div>
                        <div>🌫️ Smart monitoring required</div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>
        </div>
    );
}