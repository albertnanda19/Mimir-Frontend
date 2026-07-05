"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getSnapshot(): boolean {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

export function useIsDarkTheme(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
