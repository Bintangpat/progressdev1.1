import type { Metadata } from "next";
import { Inter, Geist_Mono, EB_Garamond, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AppSessionProvider } from "@/components/providers/session-provider";
import "./globals.css";
import { cn } from "@/lib/utils";

const spaceGroteskHeading = Space_Grotesk({subsets:['latin'],variable:'--font-heading'});

const ebGaramond = EB_Garamond({subsets:['latin'],variable:'--font-serif'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevProgress — Project Monitoring",
  description:
    "Platform transparan untuk monitoring progress proyek development secara real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={cn("font-serif", ebGaramond.variable, spaceGroteskHeading.variable)}>
      <body
        className={`${inter.variable} ${geistMono.variable} ${geistMono.className} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AppSessionProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster richColors position="top-right" />
          </AppSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
