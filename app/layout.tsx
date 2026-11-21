import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FixMate | Expert Device & Appliance Repair Services",
    template: "%s | FixMate",
  },
  description:
    "Connect with vetted local technicians for smartphone, laptop, AC, refrigerator, TV, and appliance repairs with transparent pricing and pay-after-completion protection.",
  keywords: [
    "device repair",
    "smartphone repair",
    "laptop repair",
    "appliance service",
    "AC repair",
    "refrigerator repair",
    "technician marketplace",
  ],
  authors: [{ name: "FixMate Engineering Team" }],
  openGraph: {
    title: "FixMate | Expert Device & Appliance Repair Services",
    description:
      "On-demand device and home appliance repairs with zero upfront risk. Settle invoice only after repair completion.",
    type: "website",
    locale: "en_US",
    siteName: "FixMate",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('fixmate-theme');if(t==='dark'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        {children}
      </body>
    </html>
  );
}
