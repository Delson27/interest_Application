import { forwardRef, useState, useEffect } from "react";
import { getAccounts } from "../../services/api";

const CustomerSelect = forwardRef((props, ref) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoading(true);
      getAccounts(token)
        .then((data) => {
          setCustomers(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, []);

  return (
    <select
      ref={ref}
      {...props}
      className="w-full p-3 border rounded-lg"
      disabled={loading}
    >
      <option value="">
        {loading ? "Loading customers..." : "Select Customer"}
      </option>
      {customers.map((customer) => (
        <option key={customer._id} value={customer._id}>
          {customer.customerName} ({customer.accountType})
        </option>
      ))}
    </select>
  );
});

export default CustomerSelect;
