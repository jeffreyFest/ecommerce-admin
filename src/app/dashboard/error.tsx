"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-md">
        <h2 className="text-xl font-bold text-red-800 mb-2">
          Something went wrong!
        </h2>
        <p className="text-red-600 mb-4">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={reset}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
