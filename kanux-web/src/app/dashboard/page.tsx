import { Sidebar } from "@/components/layout/Sidebar/Sidebar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Sidebar />

      <main className="ml-70 p-8">
        {children ?? (
          <div className="h-96 rounded-lg bg-white border flex items-center justify-center text-muted-foreground">
            Private page content
          </div>
        )}
      </main>
    </div>
  );
}
