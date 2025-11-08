import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ApiStatusBanner } from "@/components/ApiStatus";
import Home from "./pages/Home";
import Cottages from "./pages/Cottages";
import CottageDetail from "./pages/CottageDetail";
import Restaurant from "./pages/Restaurant";
import Activities from "./pages/Activities";
import Conference from "./pages/Conference";
import ConferenceBooking from "./pages/ConferenceBooking";
import Gallery from "./pages/Gallery";
import Booking from "./pages/Booking";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ApiStatusBanner />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cottages" element={<Cottages />} />
            <Route path="/cottages/:id" element={<CottageDetail />} />
            <Route path="/restaurant" element={<Restaurant />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/conference" element={<Conference />} />
            <Route path="/conference-booking" element={<ConferenceBooking />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
