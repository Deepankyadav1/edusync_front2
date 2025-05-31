import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const AddCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setMediaFile(e.target.files[0]);
  };

  const uploadFileToAzure = async (file) => {
    try {
      // Step 1: Request a SAS token
      const sasRes = await API.get(`/media/sas?fileName=${file.name}`);
      const { sasUrl, blobUrl } = sasRes.data;

      // Step 2: Upload to Azure using the SAS URL
      await fetch(sasUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type,
        },
        body: file,
      });

      return blobUrl;
    } catch (err) {
      console.error("Azure upload error:", err);
      throw new Error("File upload failed");
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let uploadedMediaUrl = "";

      if (mediaFile) {
        uploadedMediaUrl = await uploadFileToAzure(mediaFile);
      }

      console.log(uploadedMediaUrl);
      const token = localStorage.getItem("token");
      await API.post(
        "/courses",
        {
          title,
          description,
          mediaUrl: uploadedMediaUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log(mediaUrl);
      alert("✅ Course added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Course add error:", err);
      alert("Error: " + (err.message || "Unknown error"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3>Add New Course</h3>
      <form onSubmit={handleAddCourse}>
        <input
          className="form-control mb-2"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="form-control mb-2"
          placeholder="Description"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          type="file"
          accept=".pdf,.docx,.mp4,.png,.jpg,.jpeg"
          onChange={handleFileChange}
        />
        <button
          className="btn btn-success w-100"
          type="submit"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Add Course"}
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
