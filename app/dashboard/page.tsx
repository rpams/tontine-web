import DashboardWithData from "@/components/dashboard/DashboardWithData";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";

export default function Dashboard() {
  return (
    <ProtectedLayout>
      <DashboardWithData />
    </ProtectedLayout>
  );
}