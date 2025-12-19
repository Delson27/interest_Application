/**
 * Calculate Simple Interest
 * @param {number} principal - Principal amount
 * @param {number} rate - Interest rate (% per month or year)
 * @param {number} time - Time period (in months)
 * @param {string} frequency - 'monthly' or 'yearly'
 * @returns {object} - { interest, total }
 */
export function simpleInterest(principal, rate, time, frequency = "monthly") {
  let interest;

  if (frequency.toLowerCase() === "yearly") {
    // Rate is annual, time is in months, convert to years
    const years = time / 12;
    interest = (principal * rate * years) / 100;
  } else {
    // Rate is per month, time is in months
    interest = (principal * rate * time) / 100;
  }

  const total = principal + interest;

  return { interest, total };
}

/**
 * Calculate Compound Interest
 * @param {number} principal - Principal amount
 * @param {number} rate - Annual interest rate (%)
 * @param {number} time - Time period in years
 * @param {number} frequency - Number of times interest is compounded per year (12 for monthly, 4 for quarterly, 1 for yearly)
 * @returns {object} - { interest, total }
 */
export function compoundInterest(principal, rate, time, frequency = 12) {
  const n = frequency; // compounding frequency
  const r = rate / 100; // convert percentage to decimal

  // Compound Interest Formula: A = P(1 + r/n)^(nt)
  const amount = principal * Math.pow(1 + r / n, n * time);
  const interest = amount - principal;

  return {
    interest: Math.round(interest * 100) / 100,
    total: Math.round(amount * 100) / 100,
  };
}

/**
 * Calculate partial payment adjustment
 * @param {number} principal - Original principal
 * @param {number} rate - Interest rate
 * @param {number} paidAmount - Amount already paid
 * @param {number} monthsElapsed - Months since transaction started
 * @param {number} totalMonths - Total loan duration
 * @returns {object} - { remainingPrincipal, interestOnRemaining, newTotal }
 */
export function calculatePartialPayment(
  principal,
  rate,
  paidAmount,
  monthsElapsed,
  totalMonths
) {
  // Calculate interest up to the payment date
  const interestTillNow = (principal * rate * monthsElapsed) / 100;
  const totalTillNow = principal + interestTillNow;

  // After payment, calculate remaining
  const remainingAmount = totalTillNow - paidAmount;

  // Calculate interest on remaining amount for remaining months
  const remainingMonths = totalMonths - monthsElapsed;
  const futureInterest = (remainingAmount * rate * remainingMonths) / 100;

  return {
    remainingPrincipal: remainingAmount,
    interestOnRemaining: futureInterest,
    newTotal: remainingAmount + futureInterest,
    monthsRemaining: remainingMonths,
  };
}

/**
 * Calculate EMI (Equated Monthly Installment)
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (%)
 * @param {number} months - Loan tenure in months
 * @returns {object} - { emi, totalPayment, totalInterest }
 */
export function calculateEMI(principal, annualRate, months) {
  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    return {
      emi: principal / months,
      totalPayment: principal,
      totalInterest: 0,
    };
  }

  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  return {
    emi: Math.round(emi * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  };
}
