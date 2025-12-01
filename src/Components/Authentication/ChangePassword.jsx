"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { changepassword } from "../../API/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const navigate = useNavigate();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // ⭐ Correct mutation
  const changepasswordMutation = useMutation({
    mutationFn: (formData) => changepassword(formData),
    onSuccess: (res) => {
      toast.success("Password Changed Successfully");
      navigate("/signin"); 
      console.log(res);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Password Change Failed"
      );
    },
  });

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ⭐ Submit handler calling mutation correctly
  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();

    // Convert field names to backend expected keys
    const payload = {
      old_password: passwordForm.oldPassword,
      new_password: passwordForm.newPassword,
    };

    changepasswordMutation.mutate(payload);
  };

  return (
    <div className="bg-[#FBFBFB] min-h-screen py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="rounded-2xl w-full max-w-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center mb-8">
          Change Password
        </h2>

        <form onSubmit={handlePasswordChangeSubmit} className="space-y-6">
          {/* Old Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm text-gray-600">Old Password</label>
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                <span>Hide</span>
              </button>
            </div>
            <input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              value={passwordForm.oldPassword}
              onChange={handlePasswordInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* New Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm text-gray-600">New Password</label>
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                <span>Hide</span>
              </button>
            </div>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={changepasswordMutation.isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 rounded-full transition-colors text-lg mt-8 disabled:opacity-50"
          >
            {changepasswordMutation.isLoading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
