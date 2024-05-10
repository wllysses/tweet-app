import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "@/providers/auth";
import { ThemeProvider } from "@/providers/theme";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tweet.dev",
  description: "Publique suas ideias e interaja com pessoas da sua área!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            {children}
            <Toaster />
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
