"use client";

import NextTopLoader from "nextjs-toploader";

export default function NavigationProgressBar() {
  return (
    <NextTopLoader
      color="var(--color-brand-600)"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 10px var(--color-brand-600),0 0 5px var(--color-brand-600)"
      zIndex={1600}
    />
  );
}
