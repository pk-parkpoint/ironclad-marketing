import type { ReactNode } from "react";
import { IroncladMotionRoot } from "@/components/motion/ironclad-motion";
import "@/components/motion/ironclad-motion.css";

export default function PlumbingLayout({ children }: { children: ReactNode }) {
  return <IroncladMotionRoot as="div">{children}</IroncladMotionRoot>;
}
