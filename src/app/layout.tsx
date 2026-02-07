import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/store/provider/ReduxProvider";

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
      <body className={`bg-primaryBg text-primaryText antialiased`}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
