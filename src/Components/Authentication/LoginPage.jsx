import { useState } from "react";
import AuthButton from "../Authentication/AuthButton";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { signin } from "../../API/api";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
  });

  const LoginMutation = useMutation({
    mutationFn: signin,
    onSuccess: (res) => {
      toast.success("Login Successful!");
      console.log("SERVER RESPONSE:", res.data);
      navigate("/feed");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Login failed");
      21;
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setFormData((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    LoginMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl lg:max-w-3xl xl:max-w-4xl rounded-lg p-6 sm:p-8">
        <h1 className="text-5xl font-bold text-center text-gray-900 mb-6">
          Log In
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-md text-gray-600 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-md text-gray-600 mb-2">Password</label>
            <div className="relative">
              <input
                type={formData.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {formData.showPassword ? "Hide" : "👁"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <AuthButton
            text={LoginMutation.isPending ? "Logging in..." : "Log In"} // isLoading state remvoved for simplicity
            type="submit"
            className="w-full"
          />

          <p className="text-center text-md text-gray-600">
            <Link to="/settings/profile_settings/forget_password">
              <button
                type="button"
                className="text-blue-500 hover:text-blue-600 font-medium cursor-pointer"
              >
                Forget your password
              </button>
            </Link>
          </p>
          {/* Signup Link */}
          <p className="text-center text-md text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-blue-500 hover:text-blue-600 font-medium cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
