import { Link } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { addContact } from "../../../services/ContactService";

export default function Contact() {

    const [contactName, setContactName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    //CONTACT FORM
    const handleContactForm = async (e) => {
        e.preventDefault();
        if (
            !contactName ||
            !contactEmail ||
            !subject ||
            !message
        ) {
            toast.error("All fields are required");
            return;
        }
        try {
            setLoading(true);
            const formData = {
                name: contactName,
                email: contactEmail,
                subject,
                message
            };

            const res = await addContact(formData);
            if (res.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Message Sent",
                    text: "Thank you for contacting CIVORA.",
                    confirmButtonColor: "#198754"
                });

                // CLEAR FORM
                setContactName("");
                setContactEmail("");
                setSubject("");
                setMessage("");
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <main className="main">
                {/* Page Title */}
                <div className="page-title light-background">
                    <div className="container d-lg-flex justify-content-between align-items-center">
                        <h1 className="mb-2 mb-lg-0">Contact</h1>
                        <nav className="breadcrumbs">
                            <ol>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="current">Contact</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                {/* End Page Title */}

                {/* Contact Section */}
                <section id="contact" className="contact section">
                    {/* Map Section */}
                    <div className="map-container mb-5">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13774546.535066167!2d77.7919254406362!3d21.878762103143828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1778922567467!5m2!1sen!2sin"
                            width="100%"
                            height={500}
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                    <div className="container" data-aos="fade-up" data-aos-delay={100}>
                        {/* Contact Info */}
                        <div className="row g-4 mb-5" data-aos="fade-up" data-aos-delay={300}>
                            <div className="col-md-6">
                                <div className="contact-info-card">
                                    <div className="icon-box">
                                        <i className="bi bi-geo-alt" />
                                    </div>
                                    <div className="info-content">
                                        <h4>Location</h4>
                                        <p>City Municipal Help Center, Jalandhar, Punjab, India</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="contact-info-card">
                                    <div className="icon-box">
                                        <i className="bi bi-telephone" />
                                    </div>
                                    <div className="info-content">
                                        <h4>Phone &amp; Email</h4>
                                        <p>Helpline: +91 1800-123-4567</p>
                                        <p>support@civora.gov.in</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Contact Form */}
                        <div
                            className="row justify-content-center mb-5"
                            data-aos="fade-up"
                            data-aos-delay={200}
                        >
                            <div className="col-lg-10">

                                <div className="contact-form-wrapper shadow-lg p-5 rounded-5">

                                    {/* HEADING */}
                                    <div className="text-center mb-5">

                                        <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill mb-3">
                                            CONTACT CIVORA
                                        </span>

                                        <h2 className="fw-bold mb-3 pt-3">
                                            Send Us a Message
                                        </h2>

                                        <p className="text-muted">
                                            Have questions, feedback, or civic concerns? Our team is here to help you.
                                        </p>

                                    </div>

                                    {/* FORM */}
                                    <form
                                        className="php-email-form"
                                        onSubmit={handleContactForm}
                                    >

                                        <div className="row g-4">

                                            {/* NAME */}
                                            <div className="col-md-6">
                                                <div className="form-group">

                                                    <label className="form-label fw-semibold mb-2">
                                                        Full Name
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control custom-input"
                                                        name="name"
                                                        placeholder="Enter your name"
                                                        required=""
                                                        value={contactName}
                                                        onChange={(e) => setContactName(e.target.value)}
                                                    />

                                                </div>
                                            </div>

                                            {/* EMAIL */}
                                            <div className="col-md-6">
                                                <div className="form-group">

                                                    <label className="form-label fw-semibold mb-2">
                                                        Email Address
                                                    </label>

                                                    <input
                                                        type="email"
                                                        className="form-control custom-input"
                                                        name="email"
                                                        placeholder="Enter your email"
                                                        required=""
                                                        value={contactEmail}
                                                        onChange={(e) => setContactEmail(e.target.value)}
                                                    />

                                                </div>
                                            </div>

                                            {/* SUBJECT */}
                                            <div className="col-12">
                                                <div className="form-group">

                                                    <label className="form-label fw-semibold mb-2">
                                                        Subject
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control custom-input"
                                                        name="subject"
                                                        placeholder="Enter subject"
                                                        required=""
                                                        value={subject}
                                                        onChange={(e) => setSubject(e.target.value)}
                                                    />

                                                </div>
                                            </div>

                                            {/* MESSAGE */}
                                            <div className="col-12">
                                                <div className="form-group">

                                                    <label className="form-label fw-semibold mb-2">
                                                        Message
                                                    </label>

                                                    <textarea
                                                        className="form-control custom-input"
                                                        name="message"
                                                        placeholder="Write your message here..."
                                                        rows={4}
                                                        required=""
                                                        value={message}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* STATUS */}
                                            <div className="col-12">

                                                <div className="loading text-muted">
                                                    Loading...
                                                </div>

                                                <div className="error-message" />

                                                <div className="sent-message text-success fw-semibold">
                                                    Your message has been sent successfully!
                                                </div>

                                            </div>

                                            {/* BUTTON */}
                                            <div className="col-12 text-center">
                                                <button
                                                    type="submit"
                                                    className="btn btn-submit btn-success px-5 py-3 fw-semibold shadow-sm"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span
                                                                className="spinner-border spinner-border-sm me-2"
                                                                role="status"
                                                            />
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        "SEND MESSAGE"
                                                    )}
                                                </button>
                                            </div>

                                        </div>

                                    </form>

                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* /Contact Section */}
            </main>
        </>
    )
}