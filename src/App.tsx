import { useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";
import PriceCalculator from "./components/PriceCalculator";
import Footer from "./components/Footer";
import { CurrencyProvider } from "./components/CurrencyContext";

export default function App() {
  return (
    <CurrencyProvider>
      <AppContent />
    </CurrencyProvider>
  );
}

function AppContent() {
  const [view, setView] = useState<"home" | "calculator">("home");
  const faqRef = useRef<HTMLDivElement>(null);

  const scrollToFaq = () => {
    if (faqRef.current) {
      faqRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#e4f4ff] flex flex-col relative overflow-x-hidden select-none">
      {/* Background Ambience Sparks (iOS Liquid fluid vibe) */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[#bde2ff]/30 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-100px] w-96 h-96 rounded-full bg-blue-300/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-100px] w-96 h-96 rounded-full bg-indigo-300/10 blur-3xl pointer-events-none" />

      {/* Header Navigation */}
      <Navbar currentView={view} setView={setView} scrollToFaq={scrollToFaq} />

      {/* Main Content Area with fluid slide transitions */}
      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          {view === "home" ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
            >
              <HomeView setView={setView} faqRef={faqRef} />
            </motion.div>
          ) : (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
            >
              <PriceCalculator setView={setView} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer bar */}
      <Footer />
    </div>
  );
}
