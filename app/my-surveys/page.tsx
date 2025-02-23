'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/src/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import CreateSurveyButton from "@/src/components/create-survey-button";
import EditSurveyModal from "@/src/components/edit-survey-modal";

interface Survey {
    _id: string;
    name: string;
    questions: { title: string; type: "open" | "mcq"; answers?: string[] }[];
}

export default function MySurveys() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
    const [deletingSurvey, setDeletingSurvey] = useState<Survey | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchSurveys = async () => {
            setLoading(true);
            setError(null);
            try {
                const userId = document.cookie.replace(/(?:(?:^|.*;\s*)userId\s*=\s*([^;]*).*$)|^.*$/, "$1");
                if (!userId) router.push('/')
                const response = await fetch(`http://127.0.0.1:3000/api/surveys/user/${userId}`);
                if (!response.ok) throw new Error("Surveys not found.");
                const data: Survey[] = await response.json();
                setSurveys(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Erreur inconnue.");
            } finally {
                setLoading(false);
            }
        };
        fetchSurveys();
    }, []);

    const handleDeleteSurvey = async () => {
        if (!deletingSurvey) return;
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/surveys/${deletingSurvey._id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Erreur lors de la suppression du sondage");
            setSurveys(surveys.filter(s => s._id !== deletingSurvey._id));
            setDeletingSurvey(null);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Une erreur inconnue est survenue.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 px-4">
            <h1 className="text-3xl font-bold mb-6">My surveys</h1>
            {loading ? (
                <div>Loading datas...</div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {surveys.length > 0 ? (
                        surveys.map((survey) => (
                            <Card key={survey._id} className="shadow-md">
                                <CardHeader>
                                    <CardTitle>{survey.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-between items-center">
                                    <Button onClick={() => router.push(`/survey/${survey._id}`)}>
                                        See details
                                    </Button>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingSurvey(survey)} className="text-gray-600 hover:text-blue-500">
                                            <Edit size={20} />
                                        </button>
                                        <button onClick={() => setDeletingSurvey(survey)} className="text-gray-600 hover:text-red-500">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p>Aucun sondage disponible.</p>
                    )}
                </div>
            )}
            <div className="mt-6">
                <CreateSurveyButton onSurveyCreated={(newSurvey) => setSurveys([...surveys, newSurvey])} />
            </div>
            {editingSurvey && (
                <EditSurveyModal
                    survey={editingSurvey}
                    onClose={() => setEditingSurvey(null)}
                    onSurveyUpdated={(updatedSurvey) => {
                        setSurveys(surveys.map(s => s._id === updatedSurvey._id ? updatedSurvey : s));
                        setEditingSurvey(null);
                    }}
                />
            )}
            <Dialog open={!!deletingSurvey} onOpenChange={(open) => !open && setDeletingSurvey(null)}>
                <DialogContent className={'bg-white'}>
                    <DialogHeader>
                        <DialogTitle>Confirm deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure to want to delete the survey?</p>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setDeletingSurvey(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteSurvey}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
