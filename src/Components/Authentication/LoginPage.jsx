import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
// import { signin } from "../../API/api";
import AuthButton from "../Authentication/AuthButton";
import { signin } from "../../API/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
  });

  const loginMutation = useMutation(signin, {
    onSuccess: (res) => {
      const access = res.data.tokens.access;
      const refresh = res.data.tokens.refresh;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!");
      navigate("/feed");
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || "Login failed");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Log In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Password</label>
            <div className="relative">
              <input
                type={formData.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {formData.showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <AuthButton
            type="submit"
            text={loginMutation.isLoading ? "Logging in..." : "Log In"}
            className="w-full"
          />
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
