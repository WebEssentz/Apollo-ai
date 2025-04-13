import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
});

export const metadata: Metadata = {
  title: "Apollo",
  description: "Apollo creates stunning UI designs from wireframes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${lora.variable}`}>
      <body className={lora.className} suppressHydrationWarning>
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
