import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/auth/sign-in");
  }
  if (session.user.role !== "ADMIN") {
    return redirect("/forbidden");
  }

  return <div className="admin-dashboard">{children}</div>;
}
