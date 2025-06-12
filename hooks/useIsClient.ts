import { useState, useEffect } from "react";

export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

export function useWindowEventListener(
  eventType: string,
  callback: EventListener,
  deps?: React.DependencyList
) {
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient || typeof window === "undefined") return;

    window.addEventListener(eventType, callback);

    return () => {
      window.removeEventListener(eventType, callback);
    };
  }, [isClient, eventType, callback, ...(deps || [])]);
}
