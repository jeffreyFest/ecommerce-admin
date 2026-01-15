import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mt-2">
          The page does not exit or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-block mt-6 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
