"use client";

import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";

interface EmiCalculatorProps {
  propertyPrice: number;
}

export default function EmiCalculator({ propertyPrice }: EmiCalculatorProps) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const downPaymentAmount = (propertyPrice * downPaymentPercent) / 100;
  const loanAmount = propertyPrice - downPaymentAmount;

  const emiDetails = useMemo(() => {
    const P = loanAmount;
    const R = interestRate / 12 / 100;
    const N = tenureYears * 12;

    if (P <= 0 || R <= 0 || N <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    return {
      emi,
      totalInterest,
      totalPayment,
    };
  }, [loanAmount, interestRate, tenureYears]);

  return (
    <div className="card p-5 mb-5">
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={20} className="text-[var(--color-brand-600)]" />
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">EMI Calculator</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sliders */}
        <div className="space-y-5">
          <div>
            <div className="flex justify-between mb-1.5 text-sm">
              <label className="font-semibold text-[var(--color-text-primary)]">Down Payment</label>
              <span className="font-bold text-[var(--color-brand-600)]">{downPaymentPercent}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-[var(--color-brand-500)] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-xs text-[var(--color-text-muted)] mt-1 text-right">
              {formatCurrency(downPaymentAmount)}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1.5 text-sm">
              <label className="font-semibold text-[var(--color-text-primary)]">Interest Rate</label>
              <span className="font-bold text-[var(--color-brand-600)]">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="15"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-[var(--color-brand-500)] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5 text-sm">
              <label className="font-semibold text-[var(--color-text-primary)]">Tenure</label>
              <span className="font-bold text-[var(--color-brand-600)]">{tenureYears} Years</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-[var(--color-brand-500)] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-[var(--color-surface-2)] p-5 rounded-xl flex flex-col justify-center">
          <div className="text-center mb-4 pb-4 border-b border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">Estimated Monthly EMI</p>
            <p className="text-3xl font-extrabold text-[var(--color-text-primary)]">
              {formatCurrency(emiDetails.emi)}
            </p>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Loan Amount</span>
              <span className="font-semibold text-[var(--color-text-primary)]">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Total Interest</span>
              <span className="font-semibold text-[var(--color-text-primary)]">{formatCurrency(emiDetails.totalInterest)}</span>
            </div>
            <div className="flex justify-between pt-2 mt-2 border-t border-[var(--color-border)]">
              <span className="font-medium text-[var(--color-text-primary)]">Total Amount</span>
              <span className="font-bold text-[var(--color-brand-600)]">{formatCurrency(emiDetails.totalPayment + downPaymentAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
