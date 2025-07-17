import { createContext, useContext } from "react";

export interface DragContextType {
  hoveredMessages: Set<string>;
  setMessageHovered: (messageId: string) => void;
  unsetMessageHovered: (messageId: string) => void;
  clearAllHovered: () => void;
}

export const DragContext = createContext<DragContextType | null>(null);

export function useDragState() {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error("useDragState must be used within DragContext");
  }
  return context;
}
