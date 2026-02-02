import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import JoinLeague from "./pages/JoinLeague";
import LeagueDashboard from "./pages/LeagueDashboard";
import Teams from "./pages/Teams";
import TeamPage from "./pages/TeamPage";
import Schedule from "./pages/Schedule";
import Bookings from "./pages/Bookings";
import Playoffs from "./pages/Playoffs";
import EnterResult from "./pages/EnterResult";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/join/:code" element={<JoinLeague />} />
          <Route path="/login" element={<Login />} />
          
          {/* League-specific routes */}
          <Route path="/league/:leagueId" element={<LeagueDashboard />} />
          <Route path="/league/:leagueId/teams" element={<Teams />} />
          <Route path="/league/:leagueId/teams/:teamId" element={<TeamPage />} />
          <Route path="/league/:leagueId/schedule" element={<Schedule />} />
          <Route path="/league/:leagueId/bookings" element={<Bookings />} />
          <Route path="/league/:leagueId/playoffs" element={<Playoffs />} />
          <Route path="/league/:leagueId/enter-result" element={<EnterResult />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
