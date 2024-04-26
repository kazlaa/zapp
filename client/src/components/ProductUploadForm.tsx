import React, { useState, ChangeEvent, FormEvent } from "react";
import { config } from "../config";

const { API_URL } = config;
export const ProductUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("products", file);

    try {
      const response = await fetch(`${API_URL}/upload/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus("File uploaded successfully!");
      } else {
        setUploadStatus("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Upload failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Upload CSV File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};
