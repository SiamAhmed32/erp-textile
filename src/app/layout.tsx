import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/store/provider/ReduxProvider";
import { Toaster } from "sonner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js Starter Template",
  description:
    "A premium Next.js starter template with Tailwind CSS and Redux Toolkit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-primaryBg text-primaryText antialiased`}>
        <ReduxProvider>
          {children}
          <ToastContainer position="top-right" autoClose={1000} />
          <Toaster richColors position="top-right" />
        </ReduxProvider>
      </body>
    </html>
  );
}
