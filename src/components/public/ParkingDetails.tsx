"use client";

import React from 'react';
import { PropertyDetail } from '@/types';

interface Props {
  property: PropertyDetail;
}

export default function ParkingDetails({ property }: Props) {
  const { parkingCarCovered, parkingCarOpen, parkingBikeCovered, parkingBikeOpen, visitorParking } = property;

  const hasAnyParking = Boolean(
    parkingCarCovered || parkingCarOpen || parkingBikeCovered || parkingBikeOpen || visitorParking
  );

  if (!hasAnyParking) return null;

  return (
    <div className="card p-5 mb-5">
      <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Parking Details</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {parkingCarCovered !== undefined && parkingCarCovered > 0 && (
          <div className="bg-gray-50 border border-gray-100 rounded p-3 text-center">
            <div className="text-2xl mb-1">🚗</div>
            <div className="font-bold text-gray-800">{parkingCarCovered}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Car (Covered)</div>
          </div>
        )}
        {parkingCarOpen !== undefined && parkingCarOpen > 0 && (
          <div className="bg-gray-50 border border-gray-100 rounded p-3 text-center">
            <div className="text-2xl mb-1">🚘</div>
            <div className="font-bold text-gray-800">{parkingCarOpen}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Car (Open)</div>
          </div>
        )}
        {parkingBikeCovered !== undefined && parkingBikeCovered > 0 && (
          <div className="bg-gray-50 border border-gray-100 rounded p-3 text-center">
            <div className="text-2xl mb-1">🏍️</div>
            <div className="font-bold text-gray-800">{parkingBikeCovered}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Bike (Covered)</div>
          </div>
        )}
        {parkingBikeOpen !== undefined && parkingBikeOpen > 0 && (
          <div className="bg-gray-50 border border-gray-100 rounded p-3 text-center">
            <div className="text-2xl mb-1">🛵</div>
            <div className="font-bold text-gray-800">{parkingBikeOpen}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Bike (Open)</div>
          </div>
        )}
      </div>
      {visitorParking && (
        <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Visitor parking available in the premises
        </div>
      )}
    </div>
  );
}
