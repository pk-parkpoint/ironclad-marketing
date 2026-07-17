import { IroncladMotionRoot } from "@/components/motion/ironclad-motion";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "@/components/motion/ironclad-motion.css";
import "./data-desk.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export default function DataDeskLayout({ children }: { children: React.ReactNode }) {
  return (
    <IroncladMotionRoot
      as="div"
      className={`data-desk-site ${hankenGrotesk.variable} ${jetBrainsMono.variable}`}
    >
      {children}
    </IroncladMotionRoot>
  );
}
