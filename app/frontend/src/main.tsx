import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { BrowserRouter } from "react-router"
import AppContextProvider from "./context/AppContext.tsx"
import { Toaster } from "./components/ui/sonner.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AppContextProvider>
          <App />
          <Toaster />
        </AppContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
