'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import CreateSurveyButton from "@/src/components/create-survey-button";

interface Survey {
    _id: string;
    name: string;
}

export default function MySurveys() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchSurveys() {
            setLoading(true);
            setError(null);

            try {
                // Récupérer userId dans les cookies
                const userId = document.cookie.replace(/(?:(?:^|.*;\s*)userId\s*\=\s*([^;]*).*$)|^.*$/, "$1");

                if (!userId) {
                    throw new Error("Utilisateur non connecté.");
                }

                // Appel API pour récupérer les sondages de l'utilisateur
                const response = await fetch(`http://127.0.0.1:3000/api/surveys/user/${userId}`);
                if (!response.ok) {
                    throw new Error("Aucun sondage trouvé.");
                }

                const data: Survey[] = await response.json();
                setSurveys(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Erreur inconnue.");
            } finally {
                setLoading(false);
            }
        }

        fetchSurveys();
    }, []);

    // Ajouter le type pour newSurvey
    const handleNewSurveyCreated = (newSurvey: Survey) => {
        setSurveys([...surveys, newSurvey]);
    };

    return (
        <div className="flex flex-col items-center p-6 md:p-10">
            <h1 className="text-3xl font-bold mb-6">Mes Sondages</h1>
            <div className="w-full max-w-3xl grid gap-4">
                {loading ? (
                    <p>Chargement...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : surveys.length > 0 ? (
                    surveys.map((survey) => (
                        <Card key={survey._id} className="w-full">
                            <CardHeader>
                                <CardTitle>{survey.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={() => router.push(`/survey/${survey._id}`)}>
                                    Voir les détails
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p>Aucun sondage disponible.</p>
                )}
            </div>

            {/* Bouton pour créer un nouveau sondage */}
            <CreateSurveyButton onSurveyCreated={handleNewSurveyCreated} />
        </div>
    );
}
