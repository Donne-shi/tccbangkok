import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import FaithPage from "./pages/FaithPage.tsx";
import TeamPage from "./pages/TeamPage.tsx";
import ConstitutionPage from "./pages/ConstitutionPage.tsx";
import SermonsPage from "./pages/SermonsPage.tsx";
import MembershipPage from "./pages/MembershipPage.tsx";
import MinistriesPage from "./pages/MinistriesPage.tsx";
import ResourcesPage from "./pages/ResourcesPage.tsx";
import ResourceViewPage from "./pages/ResourceViewPage.tsx";
import EventsPage from "./pages/EventsPage.tsx";
import GivingPage from "./pages/GivingPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/faith" element={<FaithPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/constitution" element={<ConstitutionPage />} />
          <Route path="/sermons" element={<SermonsPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/ministries" element={<MinistriesPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/:slug" element={<ResourceViewPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
