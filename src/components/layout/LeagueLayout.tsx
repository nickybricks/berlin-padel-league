import { Outlet, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

export default function LeagueLayout() {
  const { leagueId } = useParams<{ leagueId: string }>();

  return (
    <Layout leagueId={leagueId}>
      <Outlet />
    </Layout>
  );
}
