import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

/**
 * Export transactions to PDF
 * @param {Array} transactions - List of transactions
 * @param {Object} summary - Summary data (totalLent, totalReceived, etc.)
 * @param {String} userName - Name of the user
 */
export const exportToPDF = (transactions, summary, userName) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();

  // Add header
  doc.setFontSize(18);
  doc.text("Transaction Report", 14, 22);

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated: ${date}`, 14, 30);
  doc.text(`User: ${userName}`, 14, 36);

  // Add summary section
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("Summary", 14, 46);

  doc.setFontSize(10);
  doc.text(
    `Total Lent: Rs ${(summary.totalLent || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    14,
    54
  );
  doc.text(
    `Total Received: Rs ${(summary.totalReceived || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    14,
    60
  );
  doc.text(
    `Outstanding: Rs ${(summary.outstanding || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    14,
    66
  );
  doc.text(`Active Accounts: ${summary.activeAccounts || 0}`, 14, 72);

  // Add transactions table
  const tableData = transactions.map((t) => [
    t.account?.customerName || "N/A",
    t.type === "LENT" ? "Lent" : "Borrowed",
    `Rs ${(t.principal || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    `${t.interestRate || 0}%`,
    new Date(t.date).toLocaleDateString(),
    new Date(t.dueDate).toLocaleDateString(),
    t.status || "ACTIVE",
  ]);

  doc.autoTable({
    startY: 80,
    head: [
      ["Customer", "Type", "Amount", "Interest", "Date", "Due Date", "Status"],
    ],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [79, 70, 229] },
    styles: { fontSize: 8 },
  });

  // Save the PDF
  doc.save(`transaction-report-${date}.pdf`);
};

/**
 * Export transactions to Excel
 * @param {Array} transactions - List of transactions
 * @param {Object} summary - Summary data
 * @param {String} userName - Name of the user
 */
export const exportToExcel = (transactions, summary, userName) => {
  // Create summary sheet data
  const summaryData = [
    ["Transaction Report"],
    ["Generated", new Date().toLocaleDateString()],
    ["User", userName],
    [],
    ["Summary"],
    [
      "Total Lent",
      `Rs ${(summary.totalLent || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    ],
    [
      "Total Received",
      `Rs ${(summary.totalReceived || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    ],
    [
      "Outstanding",
      `Rs ${(summary.outstanding || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    ],
    ["Active Accounts", summary.activeAccounts || 0],
    [],
  ];

  // Create transactions sheet data
  const transactionData = [
    [
      "Customer",
      "Type",
      "Amount",
      "Interest Rate",
      "Date",
      "Due Date",
      "Status",
      "Total Amount",
    ],
    ...transactions.map((t) => [
      t.account?.customerName || "N/A",
      t.type === "LENT" ? "Lent" : "Borrowed",
      t.principal || 0,
      `${t.interestRate || 0}%`,
      new Date(t.date).toLocaleDateString(),
      new Date(t.dueDate).toLocaleDateString(),
      t.status || "ACTIVE",
      t.totalAmount || 0,
    ]),
  ];

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Add summary sheet
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  // Add transactions sheet
  const transactionSheet = XLSX.utils.aoa_to_sheet(transactionData);
  XLSX.utils.book_append_sheet(wb, transactionSheet, "Transactions");

  // Save the file
  XLSX.writeFile(
    wb,
    `transaction-report-${new Date().toLocaleDateString()}.xlsx`
  );
};

/**
 * Export account details to PDF
 * @param {Object} account - Account details
 * @param {Array} transactions - Transactions for this account
 */
export const exportAccountPDF = (account, transactions) => {
  try {
    if (!account) {
      console.error("Account data is missing");
      alert("Cannot export: Account data is missing");
      return;
    }

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // Header
    doc.setFontSize(18);
    doc.text("Account Report", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated: ${date}`, 14, 30);

    // Account details
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Account: ${account.customerName || "N/A"}`, 14, 42);

    doc.setFontSize(10);
    doc.text(`Type: ${account.accountType || "N/A"}`, 14, 50);
    doc.text(`Email: ${account.email || "N/A"}`, 14, 56);
    doc.text(`Phone: ${account.phone || "N/A"}`, 14, 62);

    // Transactions table
    if (transactions && transactions.length > 0) {
      const tableData = transactions.map((t) => [
        t.date ? new Date(t.date).toLocaleDateString() : "N/A",
        t.type === "LENT" ? "Lent" : "Borrowed",
        `Rs ${(t.principal || 0).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        `${t.interestRate || 0}%`,
        t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "N/A",
        t.status || "ACTIVE",
      ]);

      doc.autoTable({
        startY: 70,
        head: [["Date", "Type", "Amount", "Interest", "Due Date", "Status"]],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [79, 70, 229] },
        styles: { fontSize: 9 },
      });
    } else {
      doc.setFontSize(10);
      doc.text("No transactions found for this account", 14, 80);
    }

    doc.save(`account-${account.customerName || "report"}-${date}.pdf`);
  } catch (error) {
    console.error("Error exporting PDF:", error);
    alert(`Failed to export PDF: ${error.message}`);
  }
};
