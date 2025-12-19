// Calculate Simple Interest
export const calculateSimpleInterest = (
  principal,
  rate,
  months,
  frequency = "Monthly"
) => {
  let interest;

  if (frequency === "Yearly") {
    // Rate is annual, months is duration in months
    const years = months / 12;
    interest = (principal * rate * years) / 100;
  } else {
    // Rate is per month, months is duration
    interest = (principal * rate * months) / 100;
  }

  const total = principal + interest;
  return { interest, total };
};

// Calculate Compound Interest
export const calculateCompoundInterest = (
  principal,
  rate,
  months,
  frequency = "Monthly"
) => {
  const timeInYears = months / 12;
  let annualRate, compoundingFrequency;

  if (frequency === "Yearly") {
    annualRate = rate; // Rate is already annual
    compoundingFrequency = 1; // Compound once per year
  } else {
    annualRate = rate * 12; // Convert monthly rate to annual
    compoundingFrequency = 12; // Compound monthly
  }

  const r = annualRate / 100;
  const n = compoundingFrequency;

  // A = P(1 + r/n)^(nt)
  const amount = principal * Math.pow(1 + r / n, n * timeInYears);
  const interest = amount - principal;

  return {
    interest: Math.round(interest * 100) / 100,
    total: Math.round(amount * 100) / 100,
  };
};
