import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

const queryClient = new QueryClient();

// biome-ignore lint/style/noNonNullAssertion: i know what i am doing
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <main className="h-screen flex flex-col">
            <App />
          </main>
          <Toaster />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
