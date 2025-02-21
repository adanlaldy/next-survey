'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

interface Survey {
    _id: string;
    nom: string;
}

export default function Dashboard() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function fetchSurveys() {
            try {
                const response = await fetch("http://127.0.0.1:3000/api/surveys");
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des sondages");
                }
                const data: Survey[] = await response.json();
                setSurveys(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchSurveys();
    }, []);

    return (
        <div className="flex flex-col items-center p-6 md:p-10">
            <h1 className="text-3xl font-bold mb-6">Dashboard - Vos Sondages</h1>
            <div className="w-full max-w-3xl grid gap-4">
                {surveys.length > 0 ? (
                    surveys.map((survey) => (
                        <Card key={survey._id} className="w-full">
                            <CardHeader>
                                <CardTitle>{survey.nom}</CardTitle>
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
        </div>
    );
}
