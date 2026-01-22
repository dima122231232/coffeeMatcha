"use client";

import "@/styles/fonts.css";
import "@/styles/globals.css";
import "@/styles/adaptiv.css";
import SmoothScrolling from "@/app/SmoothScrolling";
import Header from "@/app/components/Header/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <title>Coffee Matcha</title>
      <body style={{backgroundColor:"#F3F4F2"}}>
        <Header/>
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}
