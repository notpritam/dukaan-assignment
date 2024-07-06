import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { TooltipProvider } from "@/components/ui/tooltip";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased dark",
          fontSans.variable
        )}
      >
        <TooltipProvider>
          {/* <div className="flex flex-col h-screen w-full"> */}
          {/* <Header /> */}
          {/* <div className="flex flex-col"></div>
            <Toaster />
          </div> */}
          <div className="overflow-hidden h-screen w-screen">{children}</div>
        </TooltipProvider>
      </body>
    </html>
  );
}
