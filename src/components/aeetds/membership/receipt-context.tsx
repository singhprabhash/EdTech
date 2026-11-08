"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { MembershipReceipt } from "../../../services/membership";
const ReceiptContext = createContext<{
  receipt: MembershipReceipt | null;
  setReceipt: (value: MembershipReceipt | null) => void;
} | null>(null);
export function MembershipReceiptProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [receipt, setReceipt] = useState<MembershipReceipt | null>(null);
  return (
    <ReceiptContext.Provider value={{ receipt, setReceipt }}>
      {children}
    </ReceiptContext.Provider>
  );
}
export function useMembershipReceipt() {
  const context = useContext(ReceiptContext);
  if (!context) throw new Error("Membership receipt provider is required.");
  return context;
}
