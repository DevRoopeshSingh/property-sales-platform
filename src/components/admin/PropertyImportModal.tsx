"use client";

import { useState, useRef } from "react";
import { Upload, X, FileSpreadsheet, Check, AlertCircle, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { bulkImportProperties } from "@/app/admin/(dashboard)/properties/actions";
import { toast } from "sonner";
import { propertySchema } from "@/lib/validations/property";
import { z } from "zod";
import { useRouter } from "next/navigation";

interface PropertyImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyImportModal({ isOpen, onClose }: PropertyImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        validateData(json);
      } catch (error) {
        console.error("Error parsing file:", error);
        toast.error("Failed to parse the Excel file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateData = (data: any[]) => {
    const errors: Record<number, string[]> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validData: any[] = [];

    data.forEach((row, index) => {
      const rowErrors: string[] = [];
      try {
        // Basic mapping
        const mappedRow = {
          title: row.Title,
          description: row.Description,
          type: row.Type?.toUpperCase(),
          subType: row.SubType?.toUpperCase(),
          status: row.Status?.toUpperCase() || "DRAFT",
          price: Number(row.Price),
          priceLabel: row.PriceLabel,
          priceNegotiable: row.PriceNegotiable === true || String(row.PriceNegotiable).toUpperCase() === 'TRUE',
          bhk: row.BHK ? Number(row.BHK) : undefined,
          area: row.Area ? Number(row.Area) : undefined,
          carpetArea: row.CarpetArea ? Number(row.CarpetArea) : undefined,
          floor: row.Floor ? Number(row.Floor) : undefined,
          totalFloors: row.TotalFloors ? Number(row.TotalFloors) : undefined,
          locality: row.Locality?.toUpperCase().replace(/\s+/g, '_'),
          address: row.Address,
          possession: row.Possession?.toUpperCase().replace(/\s+/g, '_'),
          amenities: row.Amenities ? row.Amenities.split(',').map((a: string) => a.trim()) : [],
          images: [],
        };

        const result = propertySchema.safeParse(mappedRow);
        
        if (!result.success) {
          result.error.issues.forEach((err: z.ZodIssue) => {
            rowErrors.push(`${err.path.join('.')}: ${err.message}`);
          });
        } else {
          validData.push(result.data);
        }
      } catch {
        rowErrors.push("Failed to parse row data");
      }

      if (rowErrors.length > 0) {
        errors[index] = rowErrors;
      }
    });

    setValidationErrors(errors);
    setParsedData(data);
  };

  const handleImport = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validRowsToImport: any[] = [];
    
    parsedData.forEach((row, index) => {
      if (!validationErrors[index]) {
         const mappedRow = {
          title: row.Title,
          description: row.Description,
          type: row.Type?.toUpperCase(),
          subType: row.SubType?.toUpperCase(),
          status: row.Status?.toUpperCase() || "DRAFT",
          price: Number(row.Price),
          priceLabel: row.PriceLabel,
          priceNegotiable: row.PriceNegotiable === true || String(row.PriceNegotiable).toUpperCase() === 'TRUE',
          bhk: row.BHK ? Number(row.BHK) : undefined,
          area: row.Area ? Number(row.Area) : undefined,
          carpetArea: row.CarpetArea ? Number(row.CarpetArea) : undefined,
          floor: row.Floor ? Number(row.Floor) : undefined,
          totalFloors: row.TotalFloors ? Number(row.TotalFloors) : undefined,
          locality: row.Locality?.toUpperCase().replace(/\s+/g, '_'),
          address: row.Address,
          possession: row.Possession?.toUpperCase().replace(/\s+/g, '_'),
          amenities: row.Amenities ? row.Amenities.split(',').map((a: string) => a.trim()) : [],
          images: [],
        };
        validRowsToImport.push(mappedRow);
      }
    });

    if (validRowsToImport.length === 0) {
      toast.error("No valid rows to import.");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await bulkImportProperties(validRowsToImport);
      if (result.success) {
        toast.success(`Successfully imported ${result.count} properties.`);
        router.refresh();
        onClose();
      } else {
        toast.error(result.error || "Failed to import properties.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred during import.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setParsedData([]);
    setValidationErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Import Properties from Excel</h2>
            <p className="text-sm text-gray-500 mt-1">Upload a spreadsheet to bulk create or update properties.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!file ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-12 bg-gray-50/50">
              <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-4">
                <FileSpreadsheet size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your spreadsheet</h3>
              <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
                Drag and drop your .xlsx or .csv file here, or click to browse files from your computer.
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-primary"
                >
                  Select File
                </button>
                <a
                  href="/api/admin/properties/template"
                  className="btn btn-secondary flex items-center gap-2"
                  download="properties_template.xlsx"
                >
                  <Download size={16} />
                  Download Template
                </a>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="text-[var(--color-brand-600)]" size={24} />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB • {parsedData.length} rows detected</p>
                  </div>
                </div>
                <button onClick={reset} className="text-sm text-red-600 font-medium hover:text-red-700">
                  Remove
                </button>
              </div>

              {parsedData.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                    <span>Data Preview</span>
                    <span className="text-sm font-normal text-gray-500">
                      {parsedData.length - Object.keys(validationErrors).length} Valid • {Object.keys(validationErrors).length} Invalid
                    </span>
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-700">
                        <tr>
                          <th className="px-4 py-3 font-medium border-b border-gray-200 w-10">Status</th>
                          <th className="px-4 py-3 font-medium border-b border-gray-200">Title</th>
                          <th className="px-4 py-3 font-medium border-b border-gray-200">Type</th>
                          <th className="px-4 py-3 font-medium border-b border-gray-200">Price</th>
                          <th className="px-4 py-3 font-medium border-b border-gray-200 min-w-[200px]">Issues</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {parsedData.slice(0, 50).map((row, idx) => (
                          <tr key={idx} className={validationErrors[idx] ? "bg-red-50/30" : ""}>
                            <td className="px-4 py-3 text-center">
                              {validationErrors[idx] ? (
                                <AlertCircle size={16} className="text-red-500" />
                              ) : (
                                <Check size={16} className="text-green-500" />
                              )}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900 line-clamp-1">{row.Title || "Missing Title"}</td>
                            <td className="px-4 py-3 text-gray-600">{row.Type}</td>
                            <td className="px-4 py-3 text-gray-600">{row.Price} {row.PriceLabel}</td>
                            <td className="px-4 py-3 text-red-600 text-xs">
                              {validationErrors[idx]?.join(", ") || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {parsedData.length > 50 && (
                    <p className="text-xs text-gray-500 text-center mt-4">Showing first 50 rows only.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button 
            onClick={onClose} 
            className="btn btn-secondary"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button 
            onClick={handleImport}
            className="btn btn-primary flex items-center gap-2"
            disabled={!file || Object.keys(validationErrors).length === parsedData.length || isProcessing}
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <Upload size={16} />
                Import Valid Rows
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
