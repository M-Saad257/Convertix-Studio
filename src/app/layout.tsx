import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
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
  keywords: [
    "Convertix Studio",
    "Global Digital Agency",
    "Web Development",
    "UI/UX Design",
    "SEO Optimization",
    "E-commerce Solutions",
    "Digital Strategy",
    "Next.js Development",
    "Modern Web Design",
    "Conversion Rate Optimization",
    "High Performance Websites",
    "Brand Engineering",
    "Creative Digital Solutions",
    "Performance Marketing",
    "Technical SEO",
    "Custom Web Applications"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-background text-foreground`}>
        <main className="min-h-screen">{children}</main>
        {/* <WhatsAppButton /> */}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
