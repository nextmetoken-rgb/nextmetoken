"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "hinglish" | "english";

export interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  tipsEnabled: boolean;
  setTipsEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("hinglish");
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [tipsEnabled, setTipsEnabledState] = useState<boolean>(true);

  useEffect(() => {
    const savedLang = localStorage.getItem("app_language") as Language;
    if (savedLang) setLanguageState(savedLang);

    const savedSound = localStorage.getItem("app_sound");
    if (savedSound !== null) setSoundEnabledState(savedSound === "true");

    const savedTips = localStorage.getItem("app_tips");
    if (savedTips !== null) setTipsEnabledState(savedTips === "true");
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_language", lang);
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem("app_sound", String(enabled));
  };

  const setTipsEnabled = (enabled: boolean) => {
    setTipsEnabledState(enabled);
    localStorage.setItem("app_tips", String(enabled));
  };

  return (
    <SettingsContext.Provider
      value={{
        language,
        setLanguage,
        soundEnabled,
        setSoundEnabled,
        tipsEnabled,
        setTipsEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};
