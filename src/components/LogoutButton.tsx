"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="w-full mt-4 bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-sm"
    >
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
}
