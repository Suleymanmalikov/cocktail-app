"use client";
import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <motion.div
      className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
}
