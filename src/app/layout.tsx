import type { Metadata } from "next";
import "./globals.css";
import SessionProviderComponent from '@/components/SessionProviderComponent';

export const metadata: Metadata = {
  title: "Home - To Do List",
  description: "Aplikasi To Do List",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProviderComponent>
          {children}
        </SessionProviderComponent>
      </body>
    </html>
  );
}
