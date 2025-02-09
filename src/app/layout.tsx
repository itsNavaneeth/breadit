import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/Toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "Breadit",
  description: "A Reddit clone built with Next.js and TypeScript.",
};
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        inter.className
      )}
    >
      <Providers>
        <body className="min-h-screen pt-12 bg-slate-50 antialiased">
          {/* @ts-expect-error server component */}
          <Navbar />
          {authModal}
          <div className="container bg-slate-50 max-w-7xl mx-auto h-full pt-12">
            {children}
          </div>
          <Toaster />
          <SpeedInsights />
        </body>
      </Providers>
    </html>
  );
}
