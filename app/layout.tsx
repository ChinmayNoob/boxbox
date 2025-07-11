import type { Metadata } from "next";
import { Geist, Geist_Mono, Onest } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";

import Header from "@/components/common/header";
import Background from "@/components/common/background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const f1Bold = localFont({
  src: "./fonts/Formula1-Bold_web.ttf",
  variable: "--font-f1-bold",
});

const f1Regular = localFont({
  src: "./fonts/Formula1-Regular_web.ttf",
  variable: "--font-f1-regular",
});

const f1Wide = localFont({
  src: "./fonts/Formula1-Wide_web.ttf",
  variable: "--font-f1-wide",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${onest.variable} ${f1Bold.variable} ${f1Regular.variable} ${f1Wide.variable} antialiased relative`}
      >
        <Background />
        <Header
          firstAnchorRef='#schedule'
          secondAnchorRef='#results'
          thirdAnchorRef='#teams'
          fourAnchorRef='#drivers'
        />

        {children}
      </body>
    </html>
  );
}
