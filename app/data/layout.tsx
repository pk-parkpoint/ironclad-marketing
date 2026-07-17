import { IroncladMotionRoot } from "@/components/motion/ironclad-motion";
import "@/components/motion/ironclad-motion.css";
import "./data-desk.css";

export default function DataDeskLayout({ children }: { children: React.ReactNode }) {
  return <IroncladMotionRoot as="div" className="data-desk-site">{children}</IroncladMotionRoot>;
}
