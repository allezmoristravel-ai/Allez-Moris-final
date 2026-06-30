"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from "next/navigation";

const ScrollToHash = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, searchParams]);

  return null;
};

export default ScrollToHash;
