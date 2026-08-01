import React, { useState, useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LogiCityDescription from "./pages/LogiCityDescription";
import NewsDetail from "./pages/NewsDetail";
import Store from "./pages/Store";
import MapRotation from "./pages/MapRotation";
import License from "./pages/License";
import ServerMaintenancement from "./pages/ServerMaintenancement";
import "./App.css";
import NewsWebView from "./pages/LiteStars/WebView/News(WebView)";
import {servermaintenanacement} from "./config";


function AppContent({
  theme,
  setTheme,
  isSeasonal,
  maintenancement,
}: {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  isSeasonal: boolean;
  maintenancement: boolean;
}) {
  const location = useLocation();
  const hideShell = location.pathname === "/LiteStars/webview/News" || location.pathname === "/shop" || location.pathname === "/voucher" || location.pathname === "/map";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {!hideShell && <Navbar theme={theme} setTheme={setTheme} isSeasonal={isSeasonal} />}
      <main className={`flex-grow ${hideShell ? "pt-0" : "pt-20"}`}>
        <Routes>
          {maintenancement ? (
            <Route path="*" element={<ServerMaintenancement />} />
          ) : (
            <>
              <Route path="/" element={<LogiCityDescription />} />
              <Route path="/newsdetail" element={<NewsDetail />} />
              <Route path="/store" element={<Store />} />
              <Route path="/maprotation" element={<MapRotation />} />
              <Route path="/license" element={<License />} />
              <Route path="/LiteStars/webview/News" element={<NewsWebView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </main>
      {!hideShell && <Footer />}
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  const [Maintenancement] = useState(() => {
    return servermaintenanacement.maintenancement;
  });

  const [isSeasonal] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <HashRouter>
      <AppContent
        theme={theme}
        setTheme={setTheme}
        isSeasonal={isSeasonal}
        maintenancement={Maintenancement}
      />
    </HashRouter>
  );
}

export default App;
