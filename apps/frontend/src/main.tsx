import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import AppContextProvider from "./context/AppContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AppContextProvider>
            <App />
            <Toaster />
          </AppContextProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
