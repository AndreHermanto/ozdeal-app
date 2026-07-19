import { Calculator, MessageSquare, Ship, Compass } from "lucide-react";
import { motion } from "motion/react";
import OzDealLogo from "./OzDealLogo";

interface NavbarProps {
  currentView: "home" | "calculator";
  setView: (view: "home" | "calculator") => void;
  scrollToFaq: () => void;
}

export default function Navbar({ currentView, setView, scrollToFaq }: NavbarProps) {
  const isHome = currentView === "home";

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#e4f4ff]/80 border-b border-blue-100/60 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo with Kangaroo Vibe */}
        <button
          onClick={() => setView("home")}
          className="flex items-center gap-3 group focus:outline-none cursor-pointer"
        >
          <OzDealLogo size="md" />
          <div className="text-left">
            <span className="block font-display text-xl font-extrabold text-[#003b73] leading-none tracking-tight">
              OzDeal
            </span>
            <span className="block text-[10px] text-blue-600 font-mono tracking-widest uppercase font-semibold">
              Australia Shipping
            </span>
          </div>
        </button>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => {
              setView("home");
              // Wait slightly for render before scrolling if on calculator
              if (currentView === "calculator") {
                setTimeout(scrollToFaq, 100);
              } else {
                scrollToFaq();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#003b73] rounded-lg transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-blue-500" />
            <span className="hidden sm:inline">FAQ & Bantuan</span>
            <span className="sm:hidden">FAQ</span>
          </button>

          {!isHome && (
            <button
              onClick={() => setView("home")}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 border border-[#003b73] text-[#003b73] rounded-xl text-sm font-semibold bg-white/50 hover:bg-[#003b73]/5 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
            >
              <span className="hidden sm:inline">Kembali ke Beranda</span>
              <span className="sm:hidden">Kembali</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
