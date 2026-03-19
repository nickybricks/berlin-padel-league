import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import LeagueLayout from "@/components/layout/LeagueLayout";

import Home from "./pages/Home";
import DemoPage from "./demo/DemoPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyLeagues from "./pages/MyLeagues";
import Onboarding from "./pages/Onboarding";
import CreateLeague from "./pages/CreateLeague";
import JoinLeague from "./pages/JoinLeague";

import LeagueDashboard from "./pages/LeagueDashboard";
import Teams from "./pages/Teams";
import TeamPage from "./pages/TeamPage";
import Schedule from "./pages/Schedule";
import Bookings from "./pages/Bookings";
import Playoffs from "./pages/Playoffs";
import EnterResult from "./pages/EnterResult";
import LeagueAdmin from "./pages/LeagueAdmin";
import PlaytomicSearch from "./pages/PlaytomicSearch";
import NotFound from "./pages/NotFound";
import DesignSystem from "./pages/DesignSystem";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leagues" element={<MyLeagues />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/create-league" element={<CreateLeague />} />
          <Route path="/join/:code" element={<JoinLeague />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/design" element={<DesignSystem />} />

          {/* League-specific routes (persistent layout) */}
          <Route path="/league/:leagueId" element={<LeagueLayout />}>
            <Route index element={<LeagueDashboard />} />
            <Route path="teams" element={<Teams />} />
            <Route path="teams/:teamId" element={<TeamPage />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="playoffs" element={<Playoffs />} />
            <Route path="enter-result" element={<EnterResult />} />
            <Route path="playtomic" element={<PlaytomicSearch />} />
            <Route path="admin" element={<LeagueAdmin />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

