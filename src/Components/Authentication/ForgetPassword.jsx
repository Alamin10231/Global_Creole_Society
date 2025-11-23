import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { forgetpassword } from "../../API/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const forgetpasswordMutation = useMutation({
    mutationFn: forgetpassword,
    onSuccess: (res) => {
      toast.success(res.data?.message || "OTP sent successfully");
      navigate("/settings/profile_settings/change_password"); // navigate after success
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    const payload = { email }; // email is a string
    forgetpasswordMutation.mutate(payload);
    setMessage(`A password reset link would be sent to: ${email}`);
    setEmail(""); // clear input
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        {message && (
          <p className="text-center text-sm mb-3 text-blue-600">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={forgetpasswordMutation.isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {forgetpasswordMutation.isLoading
              ? "Sending..."
              : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
