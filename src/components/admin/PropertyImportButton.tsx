"use client";

import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import { PropertyImportModal } from "./PropertyImportModal";

export function PropertyImportButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="btn btn-secondary flex items-center gap-2"
      >
        <FileSpreadsheet size={18} />
        Import Excel
      </button>
      <PropertyImportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
