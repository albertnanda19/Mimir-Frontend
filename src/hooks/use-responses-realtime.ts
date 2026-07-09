"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

const THROTTLE_MS = 30_000;

export function useResponsesRealtime(onSignal: () => void) {
  const lastRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("dashboard-responses")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "responses" }, () => {
        const elapsed = Date.now() - lastRef.current;
        if (elapsed < THROTTLE_MS) {
          if (!timerRef.current) {
            timerRef.current = setTimeout(() => {
              timerRef.current = null;
              lastRef.current = Date.now();
              onSignal();
            }, THROTTLE_MS - elapsed);
          }
          return;
        }
        lastRef.current = Date.now();
        onSignal();
      })
      .subscribe();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      supabase.removeChannel(channel);
    };
  }, [onSignal]);
}
