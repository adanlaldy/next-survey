'use client';
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface EditSurveyModalProps {
    survey: {
        _id: string;
        name: string;
        questions: { title: string; type: "open" | "mcq"; answers?: string[] }[];
    };
    onClose: () => void;
    onSurveyUpdated: (updatedSurvey: any) => void;
}

export default function EditSurveyModal({ survey, onClose, onSurveyUpdated }: EditSurveyModalProps) {
    const [surveyName, setSurveyName] = useState(survey.name);
    const [questions, setQuestions] = useState(survey.questions);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const addQuestion = (type: "open" | "mcq") => {
        setQuestions([...questions, { title: "", type, answers: type === "mcq" ? [""] : undefined }]);
    };

    const deleteQuestion = (index: number) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };

    const updateQuestion = (index: number, field: string, value: string | string[]) => {
        const updatedQuestions = [...questions];
        if (field === "answers" && Array.isArray(value)) {
            updatedQuestions[index].answers = value;
        } else if (field === "title" && typeof value === "string") {
            updatedQuestions[index].title = value;
        }
        setQuestions(updatedQuestions);
    };

    const handleUpdateSurvey = async () => {
        if (!surveyName.trim()) {
            setError("Le nom du sondage est requis.");
            return;
        }

        if (questions.length === 0) {
            setError("Ajoutez au moins une question.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`http://127.0.0.1:3000/api/surveys/${survey._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: surveyName,
                    questions,
                }),
            });

            if (!response.ok) throw new Error("Erreur lors de la mise à jour du sondage");

            const updatedSurvey = await response.json();
            onSurveyUpdated(updatedSurvey);
            onClose();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Une erreur inconnue est survenue.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        Modifier le sondage
                    </h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-red-500">
                        <X size={20} />
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Nom du sondage"
                    value={surveyName}
                    onChange={(e) => setSurveyName(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {questions.map((question, index) => (
                    <div key={index} className="mb-4 relative">
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Intitulé de la question"
                                value={question.title}
                                onChange={(e) => updateQuestion(index, "title", e.target.value)}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={() => deleteQuestion(index)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {question.type === "mcq" && (
                            <div className="space-y-2">
                                {question.answers?.map((answer, idx) => (
                                    <input
                                        key={idx}
                                        type="text"
                                        placeholder={`Réponse ${idx + 1}`}
                                        value={answer}
                                        onChange={(e) => {
                                            const newAnswers = [...question.answers!];
                                            newAnswers[idx] = e.target.value;
                                            updateQuestion(index, "answers", newAnswers);
                                        }}
                                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ))}
                                <Button
                                    onClick={() => {
                                        const newAnswers = [...question.answers!, ""];
                                        updateQuestion(index, "answers", newAnswers);
                                    }}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                                >
                                    Ajouter une réponse
                                </Button>
                            </div>
                        )}
                    </div>
                ))}

                <div className="flex gap-2 mb-4">
                    <Button
                        onClick={() => addQuestion("open")}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                        Ajouter une question ouverte
                    </Button>
                    <Button
                        onClick={() => addQuestion("mcq")}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                        Ajouter un QCM
                    </Button>
                </div>

                {error && <p className="text-red-500 mb-2">{error}</p>}

                <Button
                    onClick={handleUpdateSurvey}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                    {loading ? "Mise à jour..." : "Mettre à jour le sondage"}
                </Button>
            </div>
        </div>
    );
}