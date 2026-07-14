"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-500"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h1>
      <p className="text-slate-600 mb-6 max-w-md">
        An error occurred while loading this page. Please try again.
      </p>
      {error.digest && (
        <p className="text-xs text-slate-400 mb-4 font-mono">
          Error ID: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        className="btn btn-primary px-6"
      >
        Try Again
      </button>
    </div>
  );
}
