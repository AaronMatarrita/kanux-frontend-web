import { Sidebar } from "@/components/layout/Sidebar/Sidebar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f8f8] flex">
      <Sidebar />

      <main className="ml-70 flex-1 p-8">{children}</main>
    </div>
  );
}
