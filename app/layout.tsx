import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIBlog | AI-Powered Blogging Platform",
  description: "Create, generate, and share beautiful blogs with the power of AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-slate-50 text-slate-900 min-h-screen pt-16")}>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} AIBlog Platform. Built with Next.js, Prisma, and OpenAI.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
