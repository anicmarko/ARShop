import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ModalProvider from "@/providers/modal-provider";
import { ToasterProvider } from "@/providers/toast-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import BackToTop from "@/components/ui/back-to-top";
import AnnouncementBar from "@/components/announcement-bar";
import CartDrawer from "@/components/cart-drawer";
import Newsletter from "@/components/newsletter";
import MobileBottomNav from "@/components/mobile-bottom-nav";

const font = Urbanist({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "ARShop",
    description: "Premium fashion store",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <ClerkProvider>
        <html lang="en" suppressHydrationWarning>
            <body className={`${font.className} bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 transition-colors duration-200`}>
                <ThemeProvider>
                    <AnnouncementBar />
                    <ModalProvider />
                    <ToasterProvider />
                    <CartDrawer />
                    <Navbar />
                    <main className="min-h-screen pb-16 lg:pb-0">
                        {children}
                    </main>
                    <Newsletter />
                    <Footer />
                    <MobileBottomNav />
                    <BackToTop />
                </ThemeProvider>
            </body>
        </html>
        </ClerkProvider>
    );
}
