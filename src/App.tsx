import './styles/liturgy.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DailyReadings from "./pages/DailyReadings";
import ExampleOfFaith from "./pages/ExampleOfFaith";
import Bible from "./pages/Bible";
import NotFound from "./pages/NotFound";
import FloatingAIChat from "./components/AIChat/FloatingAIChat";
import { Toaster as ReactHotToastToaster } from 'react-hot-toast';

// Initialize GSAP for better performance
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ReactHotToastToaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/daily-readings" element={<DailyReadings />} />
          <Route path="/example-of-faith" element={<ExampleOfFaith />} />
          <Route path="/bible" element={<Bible />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingAIChat />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
