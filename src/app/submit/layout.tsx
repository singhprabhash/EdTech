import type { ReactNode } from "react";
import ResourceShell from "../../components/aeetds/resources/shell";
import SubmitNavigation from "../../components/aeetds/resources/submit-navigation";
export default function SubmitLayout({ children }: { children: ReactNode }) {
  return (
    <ResourceShell activePath="/submit">
      <SubmitNavigation />
      {children}
    </ResourceShell>
  );
}
