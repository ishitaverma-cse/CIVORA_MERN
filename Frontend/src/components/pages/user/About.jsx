export default function About() {
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
                            <div className="col-lg-5">
                                <div className="image-stack">
                                    <div
                                        className="main-image-wrapper"
                                        data-aos="fade-right"
                                        data-aos-delay={200}
                                    >
                                        <img
                                            src="../assets/img/city/city.jpg"
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
                                            src="../assets/img/city/cityAbout2.jpg"
                                            alt="Luxury Suite"
                                            className="img-fluid"
                                        />
                                    </div>
                                </div>
                            </div>
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
                                    <div className="action-buttons">
                                        <a href="/issues" className="btn-explore">
                                            <i className="bi bi-plus-circle" />
                                            Report an Issue
                                        </a>
                                        <a href="/track" className="btn-video">
                                            <i className="bi bi-search" />
                                            Track Complaint
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row features-showcase">
                            <div className="col-12">
                                <div
                                    className="features-header text-center"
                                    data-aos="fade-up"
                                    data-aos-delay={100}
                                >
                                    <h3>Easy Issue Reporting</h3>
                                    <p>
                                        Report civic issues in seconds with location and image support
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-md-6">
                                <div className="feature-card" data-aos="flip-up" data-aos-delay={200}>
                                    <div className="feature-visual">
                                        <img
                                            src="../assets/img/hotel/amenities-3.webp"
                                            alt="Spa Services"
                                            className="img-fluid"
                                        />
                                        <div className="feature-overlay">
                                            <div className="feature-icon">
                                                <i className="bi bi-flower1" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="feature-details">
                                        <h4>World-Class Spa</h4>
                                        <p>
                                            Rejuvenating treatments in our award-winning wellness sanctuary
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="feature-card" data-aos="flip-up" data-aos-delay={250}>
                                    <div className="feature-visual">
                                        <img
                                            src="../assets/img/hotel/dining-4.webp"
                                            alt="Fine Dining"
                                            className="img-fluid"
                                        />
                                        <div className="feature-overlay">
                                            <div className="feature-icon">
                                                <i className="bi bi-cup-hot" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="feature-details">
                                        <h4>Gourmet Dining</h4>
                                        <p>
                                            Michelin-starred cuisine crafted by renowned executive chefs
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="feature-card" data-aos="flip-up" data-aos-delay={300}>
                                    <div className="feature-visual">
                                        <img
                                            src="../assets/img/hotel/location-2.webp"
                                            alt="Prime Location"
                                            className="img-fluid"
                                        />
                                        <div className="feature-overlay">
                                            <div className="feature-icon">
                                                <i className="bi bi-geo-alt" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="feature-details">
                                        <h4>Prime Location</h4>
                                        <p>
                                            Nestled in the heart of the city with breathtaking panoramic
                                            views
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row achievements-section">
                            <div className="col-lg-8 offset-lg-2">
                                <div
                                    className="achievements-grid"
                                    data-aos="fade-up"
                                    data-aos-delay={200}
                                >
                                    <div className="achievement-stat">
                                        <div className="stat-counter">
                                            <span
                                                data-purecounter-start={0}
                                                data-purecounter-end={236}
                                                data-purecounter-duration={2}
                                                className="purecounter"
                                            />
                                        </div>
                                        <div className="stat-description">Luxury Suites</div>
                                    </div>
                                    <div className="achievement-stat">
                                        <div className="stat-counter">
                                            <span
                                                data-purecounter-start={80}
                                                data-purecounter-end={96}
                                                data-purecounter-duration={2}
                                                className="purecounter"
                                            />
                                            %
                                        </div>
                                        <div className="stat-description">Satisfaction Rate</div>
                                    </div>
                                    <div className="achievement-stat">
                                        <div className="stat-counter">
                                            <span
                                                data-purecounter-start={0}
                                                data-purecounter-end={15}
                                                data-purecounter-duration={1}
                                                className="purecounter"
                                            />
                                        </div>
                                        <div className="stat-description">International Awards</div>
                                    </div>
                                    <div className="achievement-stat">
                                        <div className="stat-counter">
                                            <span
                                                data-purecounter-start={90}
                                                data-purecounter-end={100}
                                                data-purecounter-duration={2}
                                                className="purecounter"
                                            />
                                        </div>
                                        <div className="stat-description">Years of Excellence</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* /About Section */}
                {/* Rooms Showcase Section */}
                <section id="rooms-showcase" className="rooms-showcase section">
                    {/* Section Title */}
                    <div className="container section-title" data-aos="fade-up">
                        <span className="description-title">Rooms</span>
                        <h2>Rooms</h2>
                        <p>
                            Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
                            consectetur velit
                        </p>
                    </div>
                    {/* End Section Title */}
                    <div className="container" data-aos="fade-up" data-aos-delay={100}>
                        <div className="row gy-5">
                            <div className="col-xl-8" data-aos="zoom-in" data-aos-delay={200}>
                                <div className="hero-room-showcase">
                                    <div className="showcase-image-container">
                                        <img
                                            src="../assets/img/hotel/room-14.webp"
                                            alt="Grand Presidential Suite"
                                            className="img-fluid"
                                        />
                                        <div className="room-category-badge">
                                            <span>Presidential</span>
                                        </div>
                                        <div className="room-details-overlay">
                                            <div className="room-specs">
                                                <span className="spec-item">
                                                    <i className="bi bi-people" />
                                                    <span>6 Guests</span>
                                                </span>
                                                <span className="spec-item">
                                                    <i className="bi bi-house" />
                                                    <span>180m²</span>
                                                </span>
                                                <span className="spec-item">
                                                    <i className="bi bi-geo-alt" />
                                                    <span>Top Floor</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="showcase-content">
                                        <div className="room-title-section">
                                            <h2>Grand Presidential Suite</h2>
                                            <div className="room-rating">
                                                <div className="stars">
                                                    <i className="bi bi-star-fill" />
                                                    <i className="bi bi-star-fill" />
                                                    <i className="bi bi-star-fill" />
                                                    <i className="bi bi-star-fill" />
                                                    <i className="bi bi-star-fill" />
                                                </div>
                                                <span className="rating-text">5.0 Excellence</span>
                                            </div>
                                        </div>
                                        <p className="room-description">
                                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                                            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                                            quae ab illo inventore veritatis et quasi architecto beatae
                                            vitae dicta sunt explicabo.
                                        </p>
                                        <div className="amenities-grid">
                                            <div className="amenity-item">
                                                <i className="bi bi-wifi" />
                                                <span>Premium WiFi</span>
                                            </div>
                                            <div className="amenity-item">
                                                <i className="bi bi-tv" />
                                                <span>Smart TV</span>
                                            </div>
                                            <div className="amenity-item">
                                                <i className="bi bi-cup-hot" />
                                                <span>Coffee Bar</span>
                                            </div>
                                            <div className="amenity-item">
                                                <i className="bi bi-snow" />
                                                <span>Climate Control</span>
                                            </div>
                                        </div>
                                        <div className="booking-section">
                                            <div className="price-display">
                                                <span className="currency">$</span>
                                                <span className="amount">649</span>
                                                <span className="period">per night</span>
                                            </div>
                                            <a href="room-details.html" className="primary-booking-btn">
                                                Reserve Suite
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* End Hero Room */}
                            <div className="col-xl-4">
                                <div className="room-list-container">
                                    <div
                                        className="standard-room-card"
                                        data-aos="slide-left"
                                        data-aos-delay={250}
                                    >
                                        <div className="card-image">
                                            <img
                                                src="../assets/img/hotel/room-6.webp"
                                                alt="Executive Room"
                                                className="img-fluid"
                                            />
                                            <div className="view-link">
                                                <i className="bi bi-arrow-up-right" />
                                            </div>
                                        </div>
                                        <div className="card-content">
                                            <h4>Executive Business Room</h4>
                                            <p>
                                                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                                                odit aut fugit, sed quia consequuntur magni dolores.
                                            </p>
                                            <div className="features-list">
                                                <span>
                                                    <i className="bi bi-briefcase" />
                                                    Work Space
                                                </span>
                                                <span>
                                                    <i className="bi bi-building" />
                                                    City Views
                                                </span>
                                            </div>
                                            <div className="booking-row">
                                                <div className="price">
                                                    $329<small>/night</small>
                                                </div>
                                                <a href="room-details.html" className="book-link">
                                                    Book
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Standard Room */}
                                    <div
                                        className="standard-room-card"
                                        data-aos="slide-left"
                                        data-aos-delay={300}
                                    >
                                        <div className="card-image">
                                            <img
                                                src="../assets/img/hotel/room-19.webp"
                                                alt="Garden View"
                                                className="img-fluid"
                                            />
                                            <div className="view-link">
                                                <i className="bi bi-arrow-up-right" />
                                            </div>
                                        </div>
                                        <div className="card-content">
                                            <h4>Garden View Deluxe</h4>
                                            <p>
                                                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                                                blanditiis praesentium voluptatum deleniti atque.
                                            </p>
                                            <div className="features-list">
                                                <span>
                                                    <i className="bi bi-tree" />
                                                    Garden View
                                                </span>
                                                <span>
                                                    <i className="bi bi-door-open" />
                                                    Private Terrace
                                                </span>
                                            </div>
                                            <div className="booking-row">
                                                <div className="price">
                                                    $269<small>/night</small>
                                                </div>
                                                <a href="room-details.html" className="book-link">
                                                    Book
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Standard Room */}
                                    <div
                                        className="standard-room-card"
                                        data-aos="slide-left"
                                        data-aos-delay={350}
                                    >
                                        <div className="card-image">
                                            <img
                                                src="../assets/img/hotel/room-12.webp"
                                                alt="Family Suite"
                                                className="img-fluid"
                                            />
                                            <div className="view-link">
                                                <i className="bi bi-arrow-up-right" />
                                            </div>
                                        </div>
                                        <div className="card-content">
                                            <h4>Family Comfort Suite</h4>
                                            <p>
                                                Temporibus autem quibusdam et aut officiis debitis aut rerum
                                                necessitatibus saepe eveniet ut et voluptates.
                                            </p>
                                            <div className="features-list">
                                                <span>
                                                    <i className="bi bi-people" />
                                                    Family Space
                                                </span>
                                                <span>
                                                    <i className="bi bi-controller" />
                                                    Kids Area
                                                </span>
                                            </div>
                                            <div className="booking-row">
                                                <div className="price">
                                                    $419<small>/night</small>
                                                </div>
                                                <a href="room-details.html" className="book-link">
                                                    Book
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Standard Room */}
                                </div>
                            </div>
                        </div>
                        <div className="row mt-6">
                            <div
                                className="col-lg-3 col-sm-6"
                                data-aos="fade-up"
                                data-aos-delay={400}
                            >


                            </div>
                            {/* End Minimal Room */}

                            {/* End Minimal Room */}

                            {/* End Minimal Room */}
                        </div>
                    </div>
                </section>
                {/* /Rooms Showcase Section */}
            </main>
        </>
    )
}