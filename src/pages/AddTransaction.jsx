import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Section from "../components/AddTransaction/Section";
import Field from "../components/AddTransaction/Field";
import RadioGroup from "../components/AddTransaction/RadioGroup";
import CustomerSelect from "../components/AddTransaction/CustomerSelect";
import PreviewCard from "../components/AddTransaction/PreviewCard";
import UploadBox from "../components/AddTransaction/UploadBox";
import { simpleInterest, compoundInterest } from "../utils/interest";
import { createTransaction } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AddTransaction() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const {
    register,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const amount = watch("amount");
  const rate = watch("rate");
  const months = watch("months");
  const interestType = watch("interestType") || "Simple";
  const frequency = watch("frequency") || "Monthly";

  const preview =
    amount && rate && months
      ? (() => {
          const principal = Number(amount);
          const interestRate = Number(rate);
          const duration = Number(months);

          if (interestType === "Compound") {
            // Use Compound Interest calculation
            const timeInYears = duration / 12;
            const annualRate =
              frequency === "Yearly" ? interestRate : interestRate * 12;
            const compoundingFrequency = frequency === "Yearly" ? 1 : 12;
            return compoundInterest(
              principal,
              annualRate,
              timeInYears,
              compoundingFrequency
            );
          } else {
            // Simple Interest
            return simpleInterest(
              principal,
              interestRate,
              duration,
              frequency.toLowerCase()
            );
          }
        })()
      : null;

  const onSubmit = async (data) => {
    try {
      console.log("Form data received:", data);

      // Validate required fields
      if (!data.customer) {
        alert("Please select a customer");
        return;
      }
      if (!data.amount || !data.rate || !data.months) {
        alert("Please fill in amount, interest rate, and duration");
        return;
      }

      const transactionType =
        data.transactionType === "Lent (Given)" ? "LENT" : "BORROWED";

      // Prepare documents array from uploaded files
      const documentsArray = uploadedFiles.map((file) => ({
        filename: file.name,
        size: file.size,
        type: file.type,
      }));

      const transactionData = {
        accountId: data.customer,
        type: transactionType,
        amount: Number(data.amount),
        interestRate: Number(data.rate),
        durationMonths: Number(data.months),
        date: data.date || new Date().toISOString().split("T")[0],
        dueDate: data.dueDate,
        interestType: data.interestType || "Simple",
        paymentFrequency: data.frequency || "Monthly",
        paymentMode: data.paymentMode || "Cash",
        contact: data.contact || "",
        notes: data.notes || "",
        documents: documentsArray,
      };

      console.log("Submitting transaction data:", transactionData);
      const response = await createTransaction(transactionData, token);
      console.log("Transaction response:", response);

      if (
        response &&
        (response.transaction ||
          response.message === "Transaction created successfully")
      ) {
        alert("Transaction added successfully");
        navigate("/transactions");
      } else {
        throw new Error(response?.message || "Failed to create transaction");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert(`Failed to create transaction: ${error.message || error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h1 className="text-2xl font-semibold text-textDark">Add Transaction</h1>

      {/* Transaction Type */}
      <Section title="Transaction Type">
        <RadioGroup
          label="Type"
          options={["Lent (Given)", "Borrowed (Taken)"]}
          defaultValue="Lent (Given)"
          {...register("transactionType")}
        />
      </Section>

      {/* Customer */}
      <Section title="Customer">
        <CustomerSelect {...register("customer")} />
      </Section>

      {/* Loan Details */}
      <Section title="Loan Details">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Field label="Transaction Date" type="date" {...register("date")} />
          </div>

          <div>
            <Field
              label="Amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="200000"
              {...register("amount")}
            />
          </div>

          <div>
            <Field
              label="Interest Rate (%)"
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="2"
              {...register("rate")}
            />
          </div>

          <div>
            <Field
              label="Duration (Months)"
              type="number"
              step="1"
              min="1"
              placeholder="10"
              {...register("months")}
            />
          </div>
        </div>
      </Section>

      {/* Payment Details */}
      <Section title="Payment Details">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode of Payment
            </label>
            <select
              {...register("paymentMode")}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select payment mode</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="Cheque">Cheque</option>
              <option value="Online">Online</option>
            </select>
          </div>

          <div>
            <Field
              label="Contact Number (Optional)"
              type="tel"
              placeholder="9876543210"
              {...register("contact")}
            />
          </div>

          <div>
            <Field label="Due Date" type="date" {...register("dueDate")} />
          </div>
        </div>
      </Section>

      {/* Interest Options */}
      <Section title="Interest Options">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RadioGroup
            label="Interest Type"
            options={["Simple", "Compound"]}
            defaultValue="Simple"
            {...register("interestType")}
          />
          <RadioGroup
            label="Payment Frequency"
            options={["Monthly", "Yearly"]}
            defaultValue="Monthly"
            {...register("frequency")}
          />
        </div>
      </Section>

      {/* Preview */}
      {preview && (
        <Section title="Preview">
          <PreviewCard
            principal={amount}
            interest={preview.interest}
            total={preview.total}
            months={months}
          />
        </Section>
      )}

      {/* Documents (Optional) */}
      <Section title="Documents (Optional)">
        <UploadBox onFilesChange={setUploadedFiles} />
      </Section>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          className="px-5 py-3 rounded-lg border"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-3 rounded-lg text-white bg-primary hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Transaction"}
        </button>
      </div>
    </form>
  );
}
