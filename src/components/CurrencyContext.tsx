import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

interface CurrencyContextType {
  exchangeRate: number;
  isLoading: boolean;
  isLive: boolean;
  lastUpdated: string | null;
  refreshRate: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const DEFAULT_RATE = 12600;

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    // Try to get from localStorage to preserve across page navigations,
    // but the user's prompt says "sampai user refresh page" so a simple session or state is fine.
    // Let's use sessionStorage to ensure it doesn't do multiple API requests if they navigate,
    // but resets on complete reload/refresh.
    const cached = sessionStorage.getItem("ozdeal_aud_idr_rate");
    return cached ? parseFloat(cached) : DEFAULT_RATE;
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(() => {
    return sessionStorage.getItem("ozdeal_aud_idr_is_live") === "true";
  });
  const [lastUpdated, setLastUpdated] = useState<string | null>(() => {
    return sessionStorage.getItem("ozdeal_aud_idr_last_updated");
  });

  const fetchRate = useCallback(async () => {
    setIsLoading(true);
    
    // Attempt 1: open.er-api.com
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/AUD");
      if (!response.ok) throw new Error("Primary API failed");
      const data = await response.json();
      if (data.result === "success" && data.rates && typeof data.rates.IDR === "number") {
        const rate = Math.round(data.rates.IDR * 100) / 100; // Keep 2 decimal places or round as needed
        setExchangeRate(rate);
        setIsLive(true);
        const nowStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        setLastUpdated(nowStr);
        sessionStorage.setItem("ozdeal_aud_idr_rate", rate.toString());
        sessionStorage.setItem("ozdeal_aud_idr_is_live", "true");
        sessionStorage.setItem("ozdeal_aud_idr_last_updated", nowStr);
        setIsLoading(false);
        return;
      }
    } catch (e) {
      console.warn("Primary exchange rate API failed, trying backup...", e);
    }

    // Attempt 2: backup exchangerate-api.com
    try {
      const response = await fetch("https://api.exchangerate-api.com/v4/latest/AUD");
      if (!response.ok) throw new Error("Backup API failed");
      const data = await response.json();
      if (data.rates && typeof data.rates.IDR === "number") {
        const rate = Math.round(data.rates.IDR * 100) / 100;
        setExchangeRate(rate);
        setIsLive(true);
        const nowStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        setLastUpdated(nowStr);
        sessionStorage.setItem("ozdeal_aud_idr_rate", rate.toString());
        sessionStorage.setItem("ozdeal_aud_idr_is_live", "true");
        sessionStorage.setItem("ozdeal_aud_idr_last_updated", nowStr);
        setIsLoading(false);
        return;
      }
    } catch (e) {
      console.error("Backup exchange rate API failed as well", e);
    }

    // Fallback if both fail
    setIsLive(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const cached = sessionStorage.getItem("ozdeal_aud_idr_rate");
    if (cached) {
      setIsLoading(false);
    } else {
      fetchRate();
    }
  }, [fetchRate]);

  return (
    <CurrencyContext.Provider
      value={{
        exchangeRate,
        isLoading,
        isLive,
        lastUpdated,
        refreshRate: fetchRate,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
