'use client'

import "../../globals.css";
import Header from "@/src/components/header";
import Footer from "@/src/components/footer";

// Layout to check if the user is connected or not.
export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex flex-col min-h-screen">
            <header>
                <Header/>
            </header>
            <main className="flex flex-grow text-black">
                {children}
            </main>
            <footer>
                <Footer/>
            </footer>
        </div>
    );
}
