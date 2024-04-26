import React, { useState, ChangeEvent, FormEvent } from "react";
import { ToastContainer, toast } from "react-toastify";
import { config } from "../config";

const { API_URL } = config;
export const ProductUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    toast.info("Uploading your csv file");
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

      if (response.status !== 200) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      if (data.failedProducts.length) {
        toast.warning("Some products were not saved, check logs");
      } else {
        toast.info("Your csv file uploaded successfully");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <h2>Upload CSV File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};
