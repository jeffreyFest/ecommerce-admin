import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";



export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen text-black">
      <Sidebar
        userName={session.user?.name}
        userEmail={session.user?.email}
        userRole={session.user?.role}
      />
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
