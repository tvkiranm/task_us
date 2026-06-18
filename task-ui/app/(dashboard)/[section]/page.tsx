import { notFound } from "next/navigation";
import { getDashboardSectionConfig } from "@/components/dashboard/dashboard-data";
import ProjectsGrid from "@/components/dashboard/ProjectsGrid";

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

  if (section === "projects") {
    return <ProjectsGrid />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">{config.title}</h1>
      <p className="mt-2 text-sm text-slate-600">{config.description}</p>
    </div>
  );
}
