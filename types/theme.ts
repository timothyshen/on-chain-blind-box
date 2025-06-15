export interface Theme {
  id: string;
  name: string;
  machineBg: string;
  machineBorder: string;
  topBezelBg: string;
  topBezelText: string;
  topBezelBorder: string;
  displayWindowBg: string;
  coinSlotBg: string;
  coinSlotText: string;
  leverArmBg: string;
  leverArmBorder: string;
  leverHandleBg: string;
  leverHandleBorder: string;
  leverHandleIconColor: string;
  pageBg: string;
  controlPanelBg: string;
  controlPanelBorder: string;
  controlPanelText: string;
  modalBg: string;
  modalBorder: string;
  isDark: boolean;
  blinkingCellBg?: string;
  blinkingCellRing?: string;
  blinkingCellIconColor?: string;
  accent: string;
}

export const themes: Theme[] = [
  {
    id: "pastelDream",
    name: "Pastel",
    machineBg: "bg-gradient-to-b from-pink-200 via-purple-200 to-blue-200",
    machineBorder: "border-white/80",
    topBezelBg: "bg-gradient-to-b from-pink-100 to-purple-100",
    topBezelText: "text-purple-700",
    topBezelBorder: "border-b border-white/60",
    displayWindowBg: "bg-white/40 backdrop-blur-sm",
    coinSlotBg: "bg-white/50 backdrop-blur-sm",
    coinSlotText: "text-purple-600",
    leverArmBg: "bg-gradient-to-b from-slate-100 to-slate-200",
    leverArmBorder: "border-white",
    leverHandleBg: "bg-gradient-to-b from-yellow-200 to-yellow-300",
    leverHandleBorder: "border-yellow-100",
    leverHandleIconColor: "text-orange-600",
    pageBg: "bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50",
    controlPanelBg: "bg-white/80 backdrop-blur-md",
    controlPanelBorder: "border-purple-200/50",
    controlPanelText: "text-purple-800",
    modalBg: "bg-white/95 backdrop-blur-md",
    modalBorder: "border-purple-200",
    isDark: false,
    blinkingCellBg: "bg-yellow-300/60",
    blinkingCellRing: "ring-yellow-400",
    blinkingCellIconColor: "text-yellow-700",
    accent: "purple",
  },
];
