'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { NotepadText, Layout, LogOut, Earth } from 'lucide-react';

export default function Header() {
    const router = useRouter();

    const handleLogout = () => {
        // Supprimer le cookie "userId" en le réinitialisant avec une date d'expiration passée.
        document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // Optionnel : rediriger vers la page de connexion ou rafraîchir la page.
        router.push("/");
    };

    return (
        <header className="w-full bg-white shadow-md p-4 flex justify-between items-center">
            <p className="text-2xl font-bold flex items-center gap-2">Next survey</p>
            <nav className="flex gap-6">
                <Link href="/dashboard" className="text-lg font-medium hover:underline flex items-center gap-2">
                    <Layout size={20} />
                    Dashboard
                </Link>
                <Link href="/my-surveys" className="text-lg font-medium hover:underline flex items-center gap-2">
                    <NotepadText size={20} />
                    My surveys
                </Link>
                <Link href="/all-surveys" className="text-lg font-medium hover:underline flex items-center gap-2">
                    <Earth size={20} />
                    All surveys
                </Link>
            </nav>
            <Button onClick={handleLogout} variant="destructive" className="flex items-center gap-2">
                <LogOut size={20} />
                Log out
            </Button>
        </header>
    );
}
