const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/* ================= AUTH ================= */

export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

/* ================= ACCOUNTS ================= */

export const getAccounts = async (token) => {
  const res = await fetch(`${BASE_URL}/accounts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const createAccount = async (data, token) => {
  const res = await fetch(`${BASE_URL}/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const getAccountById = async (id, token) => {
  const res = await fetch(`${BASE_URL}/accounts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

/* ================= TRANSACTIONS ================= */

export const getTransactions = async (token) => {
  const res = await fetch(`${BASE_URL}/transactions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const createTransaction = async (data, token) => {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

/* ================= USER ================= */

export const getUser = async (token) => {
  const res = await fetch(`${BASE_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

/* ================= NOTIFICATIONS ================= */

export const getNotifications = async (token) => {
  const res = await fetch(`${BASE_URL}/user/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

/* ================= ANALYTICS ================= */

export const getAnalytics = async (token) => {
  const res = await fetch(`${BASE_URL}/user/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

/* ================= PAYMENTS ================= */

export const getTransactionById = async (id, token) => {
  const res = await fetch(`${BASE_URL}/transactions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const recordPayment = async (transactionId, data, token) => {
  const res = await fetch(
    `${BASE_URL}/transactions/${transactionId}/payments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  return res.json();
};

export const getPaymentHistory = async (transactionId, token) => {
  const res = await fetch(
    `${BASE_URL}/transactions/${transactionId}/payments`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.json();
};

/* ================= REMINDERS ================= */

export const getDuePayments = async (token) => {
  const res = await fetch(`${BASE_URL}/reminders/due`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const getUpcomingPayments = async (token) => {
  const res = await fetch(`${BASE_URL}/reminders/upcoming`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const sendNotificationReminder = async (paymentId, data, token) => {
  const res = await fetch(`${BASE_URL}/reminders/${paymentId}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};
