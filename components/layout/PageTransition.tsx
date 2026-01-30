"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
