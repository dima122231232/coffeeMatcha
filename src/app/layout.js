import "@/styles/fonts.css";
import "@/styles/globals.css";
import "@/styles/adaptiv.css";
import SmoothScrolling from "@/app/SmoothScrolling";
import Header from "@/app/components/Header/Header";
import Footer from "./components/Footer/Footer";

export const metadata = {
    title: "Coffee Matcha",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <Header/>
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
        <Footer/>
      </body>
    </html>
  );
}
