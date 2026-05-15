import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addIssue } from "../../../../services/IssueService";
import { allCategory } from "../../../../services/CategoryService";

export default function ReportIssue({ closeModal }) {

  const [categories, setCategories] = useState([]);
  // const [categoryId, setCategoryId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    location: "",
    media: null,
  });


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "media") {
      setFormData({ ...formData, media: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("User not logged in");
      return;
    }

    //Create Payload (acc to MULTER)  
    //FormData -> send files when JSON cant
    const formDataToSend = new FormData();

    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("categoryId", formData.categoryId);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("status", "Pending");
    formDataToSend.append("reportedBy", userId);
    formDataToSend.append("aiSeverityScore", 1);

    // FILE APPEND
    if (formData.media) {
      formDataToSend.append("media", formData.media);
    }

    try {
      const res = await addIssue(formDataToSend);

      if (res.data.success) {
        toast.success("Issue reported successfully!");

        // reset form AFTER success
        setFormData({
          title: "",
          description: "",
          categoryId: "",
          location: "",
          media: null
        });

        closeModal();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  //Fetch Categories
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await allCategory();
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <section className="section">
        <div className="container section-title p-0">
          <h2>Report Issue</h2>
        </div>

        <div className="container d-flex justify-content-center">
          <div className="card shadow-lg border-0 p-4" style={{ maxWidth: "700px", width: "100%", borderRadius: "15px" }}>

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                {/* Title */}
                <div className="col-12">
                  <label className="form-label">Issue Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Potholes on main road"
                    required
                  />
                </div>

                {/* CategoryId */}
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select py-2"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                  >

                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="col-md-6">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Area / Sector"
                    required
                  />
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the issue in detail..."
                    required
                  ></textarea>
                </div>

                {/* Media Upload */}
                <div className="col-12">
                  <label className="form-label">Upload Image / Video</label>
                  <input
                    required
                    type="file"
                    className="form-control"
                    name="media"
                    accept="image/*,video/*"
                    onChange={handleChange}
                  />

                  {/* Preview */}
                  {formData.media && (
                    <div className="mt-3">
                      {formData.media.type.startsWith("image") ? (
                        <img
                          src={URL.createObjectURL(formData.media)}
                          alt="preview"
                          className="img-fluid rounded"
                          style={{ maxHeight: "200px" }}
                        />
                      ) : (
                        <video
                          src={URL.createObjectURL(formData.media)}
                          controls
                          className="img-fluid rounded"
                          style={{ maxHeight: "200px" }}
                        />
                      )}

                    </div>
                  )}
                </div>

              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-success w-100 mt-4"
                style={{ borderRadius: "10px", fontWeight: "500" }}
              >
                Submit Issue
              </button>

            </form>
          </div>
        </div>
      </section>
    </>
  );
}