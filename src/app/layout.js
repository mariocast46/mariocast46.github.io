import "./globals.css";
import Providers from "./providers";             
import RouteTransition from "../components/RouteTransition"; 
import CursorFX from "../components/CursorFX";
import { Anton, B612_Mono } from "next/font/google";

const anton = Anton({ subsets:["latin"], weight:"400", variable:"--font-display" });
const b612  = B612_Mono({ subsets:["latin"], weight:"400", variable:"--font-text" });

export const metadata = { title: "Mariocast 𝄄 Creative Developer", description: "…",
  icons: {
    icon: [
      { url: "/images/Logo-Mariocast.png", type: "image/png" }, // favicon
    ],
    // opcional (iOS “Add to Home Screen”)
    apple: { url: "/images/Logo-Mariocast.png", type: "image/png" },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${anton.variable} ${b612.variable}`}>
      <body>
          <RouteTransition>{children}</RouteTransition>
          <CursorFX />
      </body>
    </html>
  );
}
