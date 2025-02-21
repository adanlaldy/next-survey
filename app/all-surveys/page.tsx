'use client'
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';  // Import des composants ShadCN
import Link from 'next/link';
import { Button } from '@/src/components/ui/button'; // Import du bouton personnalisé

interface Survey {
    _id: string;
    name: string;
    questions: { title: string }[];
}

export default function AllSurveys() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const response = await fetch('http://127.0.0.1:3000/api/surveys');
                const data = await response.json();
                setSurveys(data);
            } catch (error) {
                console.error('Failed to fetch surveys:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSurveys();
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-6">All Surveys</h1>

            {loading ? (
                <div>Loading surveys...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {surveys.map((survey) => (
                        <Card key={survey._id} className="shadow-md">
                            <CardHeader>
                                <CardTitle>{survey.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{survey.questions.length} questions</p>
                                <Link href={`/survey/${survey._id}`} passHref>
                                    <Button className="mt-2">View Details</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
