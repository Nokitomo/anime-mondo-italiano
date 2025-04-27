import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Navbar } from "./components/Navbar";
import Loading from "@/components/ui/Loading";

const Home = lazy(() => import("./pages/Home"));
const SearchPage = lazy(() => import("./pages/Search"));
const Explore = lazy(() => import("./pages/Explore"));
const AnimeList = lazy(() => import("./pages/AnimeList"));
const AnimeDetailsPage = lazy(() => import("./pages/AnimeDetails"));
const LoginPage = lazy(() => import("./pages/Login"));
const RegisterPage = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <main>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ricerca" element={<SearchPage />} />
                <Route path="/esplora" element={<Explore />} />
                <Route path="/liste" element={<AnimeList />} />
                <Route path="/anime/:id" element={<AnimeDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registrazione" element={<RegisterPage />} />
                <Route path="/profilo" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
