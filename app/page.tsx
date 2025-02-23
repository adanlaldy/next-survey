'use client'
import {LoginForm} from "@/src/components/login-form"
import {useState} from "react";
import {useRouter} from "next/navigation";

export default function Login() {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Send POST login request with datas to the API.
            const response = await fetch('http://127.0.0.1:3000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name, password}), // Envoi des données JSON
            });

            if (!response.ok) {
                throw new Error('Identifiants incorrects.');
            }

            // Waiting for response datas.
            const data = await response.json();
            console.log("Login successful:", data);

            document.cookie = `userId=${data.userId}; path=/;`;

            router.push("/my-surveys")
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur serveur.")
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm
                    onSubmit={handleSubmit}
                    nameValue={name}
                    passwordValue={password}
                    setName={setName}
                    setPassword={setPassword}
                />
                {error && <div className="text-red-500">{error}</div>}
            </div>
        </div>
    );
}