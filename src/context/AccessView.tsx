import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type AccessView = "mop" | "participant";
export type ParticipantSection = "dashboard" | "validations";

interface AccessViewContextValue {
  view: AccessView;
  setView: (view: AccessView) => void;
  participantSection: ParticipantSection;
  setParticipantSection: (section: ParticipantSection) => void;
}

const AccessViewContext = createContext<AccessViewContextValue | null>(null);

export function AccessViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AccessView>("mop");
  const [participantSection, setParticipantSection] =
    useState<ParticipantSection>("dashboard");
  const value = useMemo(
    () => ({ view, setView, participantSection, setParticipantSection }),
    [view, participantSection],
  );
  return (
    <AccessViewContext.Provider value={value}>{children}</AccessViewContext.Provider>
  );
}

export function useAccessView() {
  const ctx = useContext(AccessViewContext);
  if (!ctx) {
    throw new Error("useAccessView must be used within AccessViewProvider");
  }
  return ctx;
}
