"use client";

import React from "react";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import { DeadlineProvider, useDeadlineStore } from "@/hooks/useDeadlineStore";

function MotionWrapper({ children }: { children: React.ReactNode }) {
  const { settings } = useDeadlineStore();
  return (
    <MotionConfig reducedMotion={settings.reducedMotionOverride ? "always" : "user"}>
      {children}
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#17171C",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#FAFAFA",
          },
        }}
      />
    </MotionConfig>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DeadlineProvider>
      <MotionWrapper>{children}</MotionWrapper>
    </DeadlineProvider>
  );
}
