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
import SermonDetailPage from "./pages/SermonDetailPage.tsx";
import MembershipPage from "./pages/MembershipPage.tsx";
import MinistriesPage from "./pages/MinistriesPage.tsx";
import ResourcesPage from "./pages/ResourcesPage.tsx";
import HymnRecommendationPage from "./pages/HymnRecommendationPage.tsx";
import TheologySeriesPage from "./pages/TheologySeriesPage.tsx";
import CreedsListPage from "./pages/CreedsListPage.tsx";
import ConfessionsListPage from "./pages/ConfessionsListPage.tsx";
import ResourceViewPage from "./pages/ResourceViewPage.tsx";
import CreedViewPage from "./pages/CreedViewPage.tsx";
import EventsPage from "./pages/EventsPage.tsx";
import GivingPage from "./pages/GivingPage.tsx";
import SundaySchoolPage from "./pages/SundaySchoolPage.tsx";
import YouthWorshipPage from "./pages/YouthWorshipPage.tsx";
import YouthMinistryPage from "./pages/YouthMinistryPage.tsx";
import YouthVolunteerFormPage from "./pages/YouthVolunteerFormPage.tsx";
import YouthFellowshipFormPage from "./pages/YouthFellowshipFormPage.tsx";
import YouthResourcesPage from "./pages/YouthResourcesPage.tsx";
import AlphaYouthPage from "./pages/AlphaYouthPage.tsx";
import JohnSungBiographyPage from "./pages/JohnSungBiographyPage.tsx";
import DevotionalsPage from "./pages/DevotionalsPage.tsx";
import DevotionalDetailPage from "./pages/DevotionalDetailPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import SurveyPage from "./pages/SurveyPage.tsx";
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
          <Route path="/sermons/:slug" element={<SermonDetailPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/ministries" element={<MinistriesPage />} />
          <Route path="/ministries/hymns" element={<HymnRecommendationPage />} />
          <Route path="/ministries/youth" element={<YouthMinistryPage />} />
          <Route path="/ministries/youth/volunteer-application" element={<YouthVolunteerFormPage />} />
          <Route path="/ministries/youth/fellowship-form" element={<YouthFellowshipFormPage />} />
          <Route path="/ministries/youth-worship" element={<YouthWorshipPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/theology-series" element={<TheologySeriesPage />} />
          <Route path="/resources/youth" element={<YouthResourcesPage />} />
          <Route path="/resources/youth/alpha" element={<AlphaYouthPage />} />
          <Route path="/resources/youth/john-sung" element={<JohnSungBiographyPage />} />
          <Route path="/resources/creeds" element={<CreedsListPage />} />
          <Route path="/resources/confessions" element={<ConfessionsListPage />} />
          <Route path="/resources/:slug" element={<ResourceViewPage />} />
          <Route path="/creeds/:slug" element={<CreedViewPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/giving" element={<GivingPage />} />
          <Route path="/sunday-school" element={<SundaySchoolPage />} />
          <Route path="/devotionals" element={<DevotionalsPage />} />
          <Route path="/devotionals/:slug" element={<DevotionalDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
