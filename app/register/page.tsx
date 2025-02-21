'use client'
import { RegisterForm } from "@/src/components/register-form"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:3000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, password }),
            });

            if (!response.ok) {
                throw new Error('Échec de l\'inscription.');
            }

            const data = await response.json();
            console.log("Registration successful:", data);
            router.push("/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur serveur.");
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <RegisterForm
                    onSubmit={handleSubmit}
                    nameValue={name}
                    passwordValue={password}
                    confirmPasswordValue={confirmPassword}
                    setName={setName}
                    setPassword={setPassword}
                    setConfirmPassword={setConfirmPassword}
                />
                {error && <div className="text-red-500">{error}</div>}
            </div>
        </div>
    );
}
