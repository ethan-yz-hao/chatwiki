import type { Metadata } from "next";
import { Inter, Libre_Baskerville } from "next/font/google";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
    variable: "--font-libre-baskerville",
    weight: ["400", "700"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Wikipedia Assistant",
    description: "AI-powered Wikipedia assistant",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} ${libreBaskerville.variable} antialiased font-sans`}
            >
                {children}
            </body>
        </html>
    );
}
