import { redirect } from "next/navigation";

export default function AdminPage() {
  // Redirect to events or analytics page
  redirect("/admin/users");
}
