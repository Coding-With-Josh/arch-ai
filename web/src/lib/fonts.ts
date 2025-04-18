import { Inter, JetBrains_Mono } from 'next/font/google';
import LocalFont from "next/font/local";

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  fallback: ['system-ui', 'arial'],
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  fallback: ['system-ui', 'arial'],
});

const calSans = LocalFont({
  src: "../../public/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export const fonts = [fontSans.variable, fontMono.variable, calSans.variable];
