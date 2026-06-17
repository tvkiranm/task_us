import { notFound } from "next/navigation";
import { getDashboardSectionConfig } from "@/components/dashboard/dashboard-data";
import { DashboardSectionPage } from "@/components/dashboard/dashboard-section-page";

type DashboardDynamicSectionPageProps = {
  params: Promise<{
    section: string;
  }>;
};

export default async function DashboardDynamicSectionPage({
  params,
}: DashboardDynamicSectionPageProps) {
  const { section } = await params;
  const config = getDashboardSectionConfig(section);

  if (!config) {
    notFound();
  }

  return <DashboardSectionPage section={section} />;
}
