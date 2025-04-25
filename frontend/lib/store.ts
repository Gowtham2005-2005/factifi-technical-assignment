import { create } from "zustand"

interface FactCheckState {
  claim: string
  autoSubmit: boolean
  setClaim: (claim: string) => void
  setAutoSubmit: (autoSubmit: boolean) => void
  resetClaim: () => void
}

export const useFactCheckStore = create<FactCheckState>((set) => ({
  claim: "",
  autoSubmit: false,
  setClaim: (claim) => set({ claim }),
  setAutoSubmit: (autoSubmit) => set({ autoSubmit }),
  resetClaim: () => set({ claim: "", autoSubmit: false }),
}))
