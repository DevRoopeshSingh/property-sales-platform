"use client";

import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

export function AutoLogout({ timeoutMinutes = 15 }: { timeoutMinutes?: number }) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const logout = () => {
      // Use next-auth/react's signOut to log the user out and redirect
      signOut({ callbackUrl: "/admin/login" });
    };

    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Set timeout in milliseconds
      timeoutRef.current = setTimeout(logout, timeoutMinutes * 60 * 1000);
    };

    // Initialize timer
    resetTimer();

    // Set up event listeners to detect user activity
    const events = [
      "mousemove",
      "keydown",
      "wheel",
      "DOMMouseScroll",
      "mousewheel",
      "mousedown",
      "touchstart",
      "touchmove",
      "MSPointerDown",
      "MSPointerMove",
      "visibilitychange",
    ];

    // visibilitychange handles cases where the user comes back to the tab
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [timeoutMinutes]);

  return null; // This is a logic-only component
}
