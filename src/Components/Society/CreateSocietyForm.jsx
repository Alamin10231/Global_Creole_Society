import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createsociety } from "../../API/api"; // path adjust করুন

const CreateSocietyForm = ({ isOpen, onClose, onCreated }) => {
  // State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    privacy: "public",
  });

  // ----------------- MUTATION -----------------
  const createSocietyMutation = useMutation(createsociety, {
    onSuccess: (data) => {
      console.log("Created society:", data);
      toast.success(`Society "${data.name}" created successfully!`);
      onClose();
      setFormData({ name: "", description: "", privacy: "public" });
    },
    onError: (err) => {
      // ✅ Full error log
      console.error("Mutation error:", err);

      // Optional: specific backend message
      console.error("Backend response:", err?.response?.data);

      // Show toast if you want
      toast.error(err?.response?.data?.detail || "Failed to create society");
    },
  });

  // ----------------- HANDLERS -----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Society name is required");
      return;
    }

    // Send POST request
    try {
      const response = await createSocietyMutation.mutateAsync({
        name: formData.name,
        description: formData.description || "",
        privacy: formData.privacy,
        cover_image: null,
        cover_picture: null,
      });
      console.log("Response from server:", response);
    } catch (err) {
      console.error("Mutation error:", err);
    }
  };

  // ----------------- MODAL -----------------
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">Create Society</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-2">Society Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-gray-700 mb-2">Privacy</label>
            <select
              name="privacy"
              value={formData.privacy}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            {createSocietyMutation.isLoading ? "Creating..." : "Create"}
          </button>
        </form>

        {/* Close */}
        <button
          onClick={onClose}
          className="mt-4 bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CreateSocietyForm;
