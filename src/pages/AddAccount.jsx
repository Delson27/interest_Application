import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createAccount } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AddAccount() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await createAccount(data, token);
      console.log("Account creation response:", response);

      // Check if account was created successfully
      if (response && (response.success || response._id || response.account)) {
        alert("Account created successfully!");
        // Use replace to ensure navigation happens
        navigate("/accounts", { replace: true });
      } else {
        alert(response?.message || "Failed to create account");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Failed to create account. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h1 className="text-2xl font-semibold text-textDark">Add New Account</h1>

      {/* Account Details */}
      <div className="bg-cardBlue p-6 rounded-card shadow-card space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Account Details
        </h2>

        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name *
          </label>
          <input
            type="text"
            {...register("customerName", {
              required: "Customer name is required",
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter customer name"
          />
          {errors.customerName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.customerName.message}
            </p>
          )}
        </div>

        {/* Account Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Type *
          </label>
          <select
            {...register("accountType", {
              required: "Account type is required",
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select account type</option>
            <option value="Customer">Customer</option>
            <option value="Investor">Investor</option>
            <option value="Business">Business</option>
          </select>
          {errors.accountType && (
            <p className="mt-1 text-sm text-red-600">
              {errors.accountType.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="customer@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              {...register("phone", {
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone number must be 10 digits",
                },
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="1234567890"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            {...register("address")}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Enter address (optional)"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-3 rounded-lg text-white bg-primary hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>
      </div>
    </form>
  );
}
