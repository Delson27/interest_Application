import { Link, useLocation } from "react-router-dom";
import { getUser } from "../../services/api";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const { pathname } = useLocation(); //made use of object destructuring to get pathname directly
  // useLoaction() always returns an object with multiple properties like pathname, search, hash, state etc.

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUser(token)
        .then((response) => {
          // Handle different response formats
          setUser(response.user || response);
        })
        .catch(console.error);
    }
  }, []);

  const linkClass = (path) => {
    const isActive =
      path === "/" ? pathname === "/" : pathname.startsWith(path);

    return `block px-6 py-3 rounded-lg mb-2 cursor-pointer ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
    }`;
  };

  return (
    <aside className="w-64 bg-white shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Interest Calculator </h1>

      <nav>
        <Link to="/" className={linkClass("/")}>
          Dashboard
        </Link>

        <Link to="/transactions" className={linkClass("/transactions")}>
          Transactions
        </Link>

        {/* Only Customers can add transactions */}
        {user?.role === "Customer" && (
          <Link
            to="/transactions/add"
            className={linkClass("/transactions/add")}
          >
            Add Transaction
          </Link>
        )}

        <Link to="/accounts" className={linkClass("/accounts")}>
          Accounts
        </Link>

        <Link to="/notifications" className={linkClass("/notifications")}>
          Notifications
        </Link>

        <Link to="/profile" className={linkClass("/profile")}>
          Profile
        </Link>
      </nav>
    </aside>
  );
}
