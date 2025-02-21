// app/survey/[id]/page.tsx
'use client'; // Indique que ce composant est côté client
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Utilisez useParams au lieu de useRouter
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';

interface SurveyDetails {
    _id: string;
    name: string;
    questions: { title: string, type: string, answers?: string[] }[];
}

export default function SurveyDetailsPage() {
    const [survey, setSurvey] = useState<SurveyDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const params = useParams(); // Utilisez useParams pour accéder aux paramètres dynamiques
    const id = params.id as string; // Extrayez l'ID de l'URL

    useEffect(() => {
        console.log('hello');
        if (!id) return;

        const fetchSurvey = async () => {
            try {
                // Appel à votre API Node.js
                const response = await fetch(`http://127.0.0.1:3000/api/surveys/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch survey details');
                }
                const data = await response.json();
                setSurvey(data);
            } catch (error) {
                console.error('Failed to fetch survey details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSurvey();
    }, [id]);

    if (!id) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            {loading ? (
                <div className="text-center text-lg text-gray-600">Loading survey details...</div>
            ) : survey ? (
                <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-t-lg">
                        <CardTitle className="text-white text-2xl font-bold">
                            {survey.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {survey.questions.map((question, index) => (
                            <div key={index} className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {question.title}
                                </h3>
                                {question.answers && (
                                    <ul className="space-y-2 pl-5">
                                        {question.answers.map((answer, idx) => (
                                            <li
                                                key={idx}
                                                className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                            >
                                                {answer}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {index < survey.questions.length - 1 && (
                                    <hr className="border-t border-gray-200" />
                                )}
                            </div>
                        ))}
                    </CardContent>
                    <div className="p-6 border-t border-gray-200">
                        <Button
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => window.location.href = '/surveys'}
                        >
                            Back to Surveys
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="text-center text-lg text-gray-600">Survey not found</div>
            )}
        </div>
    );
}