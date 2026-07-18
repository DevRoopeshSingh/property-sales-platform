"use client";

import React from 'react';
import { InfoIcon, ShieldCheck } from 'lucide-react';
import { PropertyDetail } from '@/types';

interface Props {
  property: PropertyDetail;
}

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString()}`;
};

export default function PriceInsightsModule({ property }: Props) {
  const { price, marketEstimateMin, marketEstimateMax, marketEstimateActive } = property;

  if (!marketEstimateActive || !marketEstimateMin || !marketEstimateMax) {
    return (
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3 mb-5">
        <InfoIcon className="text-blue-500 w-5 h-5 mt-0.5 shrink-0" />
        <div>
          <h4 className="font-semibold text-blue-900 text-sm">Market Estimate Under Review</h4>
          <p className="text-blue-700 text-sm mt-1">
            Our local experts are currently reviewing recent trends in this project to provide an accurate valuation.
          </p>
        </div>
      </div>
    );
  }

  const isPricedFair = price <= marketEstimateMax;

  return (
    <div className="bg-white border border-[var(--color-border)] shadow-sm rounded-lg p-5 mb-5 card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2 text-[var(--color-text-primary)]">
          <ShieldCheck className="text-green-600 w-5 h-5" />
          PropConnect Verified Estimate
        </h3>
        <div className="group relative cursor-pointer">
          <InfoIcon className="w-4 h-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]" />
          <div className="absolute right-0 w-64 p-2 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 bottom-full mb-2 shadow-lg">
            This estimate is provided by our local experts based on current market trends in this specific project. It serves as a reliable guide for buyers, though it does not replace a formal appraisal.
          </div>
        </div>
      </div>

      <div className="flex items-end gap-4 mb-3">
        <div className="text-2xl font-bold text-[var(--color-text-primary)]">
          {formatCurrency(marketEstimateMin)} - {formatCurrency(marketEstimateMax)}
        </div>
      </div>

      <div className={`text-sm font-medium px-3 py-1.5 rounded inline-block ${
        isPricedFair ? 'bg-green-100 text-green-800' : 'bg-amber-50 text-amber-800'
      }`}>
        {isPricedFair 
          ? "Asking price is within or below the verified market range."
          : "Priced above typical range for this configuration."}
      </div>
    </div>
  );
}
