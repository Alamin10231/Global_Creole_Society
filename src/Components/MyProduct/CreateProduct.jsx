"use client";

import { useState } from "react";
import { FaImage, FaTimes } from "react-icons/fa";
import Navbar from "../Navbar";
import { createproduct } from "../../API/api";

function CreateProduct() {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "", // ⭐ added
  });

  const [mediaFiles, setMediaFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newMedia = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
    }));
    setMediaFiles((prev) => [...prev, ...newMedia]);
  };

  const removeMedia = (id) => {
    setMediaFiles((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.price.trim() ||
      !formData.description.trim() ||
      !formData.category
    ) {
      alert("All fields are required, including category!");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = new FormData();

      payload.append("name", formData.title);
      payload.append("price", formData.price);
      payload.append("description", formData.description);
      payload.append("category", formData.category);

      mediaFiles.forEach((media) => {
        payload.append("images", media.file);
      });

      const response = await createproduct(payload);

      alert("Product posted successfully!");

      setFormData({
        title: "",
        price: "",
        description: "",
        category: "",
      });
      setMediaFiles([]);

    } catch (error) {
      console.error("Create product failed", error);
      alert("Failed to post product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-[calc(100vh-100px)] bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Item for sale
            </h1>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Media Upload */}
              <div className="mb-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="media-upload"
                    multiple
                    accept="image/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="media-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <FaImage className="text-4xl text-blue-500 mb-2" />
                    <span className="text-gray-600 font-medium">
                      Add Media
                    </span>
                  </label>
                </div>

                {mediaFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {mediaFiles.map((media) => (
                      <div key={media.id} className="relative group">
                        <img
                          src={media.preview}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeMedia(media.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="mb-4">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Title"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Price */}
              <div className="mb-4">
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Category (Required by backend) */}
              <div className="mb-4">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Category</option>
                  <option value="1">Category 1</option>
                  <option value="2">Category 2</option>
                </select>
              </div>

              {/* Description */}
              <div className="mb-4">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  rows="6"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg disabled:opacity-60"
              >
                {isSubmitting ? "Posting..." : "Post Product"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
