import { SideRail } from "@/components/shell/side-rail";
import { AppHeader } from "@/components/shell/app-header";
import { auditIssues } from "@/data/audit";
import { countBySeverity } from "@/features/audit/lib/health";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // The rail badge counts criticals only. A badge that includes notices is a
  // badge nobody clears, and a badge nobody clears stops being read.
  const { critical } = countBySeverity(auditIssues);

  return (
    <div className="flex min-h-dvh">
      <SideRail badges={{ auditIssues: critical }} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
