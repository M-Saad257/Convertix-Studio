import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
//import WhatsAppButton from "@/components/WhatsAppButton";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Convertix Studio | Turning Clicks Into Customers",
  description:
    "Expert Web Development, SEO, and UI/UX Design services targeting high growth for your business.",
  keywords: ["Web Development", "SEO", "Digital Agency", "Convertix Studio"],
  metadataBase: new URL("https://convertix.studio"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-background text-foreground`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        {/* <WhatsAppButton /> */}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
