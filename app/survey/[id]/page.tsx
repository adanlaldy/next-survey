'use client';
import { useEffect, useState } from 'react';
import {useParams, useRouter} from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';

interface SurveyDetails {
    _id: string;
    name: string;
    questions: { _id: string, title: string, type: string, answers?: string[] }[];
}

export default function SurveyDetailsPage() {
    const [survey, setSurvey] = useState<SurveyDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [showResponseForm, setShowResponseForm] = useState(false);
    const [responses, setResponses] = useState<{ [key: string]: string | string[] }>({});
    const [surveyResponses, setSurveyResponses] = useState<any[]>([]);
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const fetchUserName = async (userId: string): Promise<string> => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/users/${userId}`);
            if (!response.ok) {
                //throw new Error('Failed to fetch user details');
            }
            const user = await response.json();
            return user.name;
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            return 'Unknown User';
        }
    };

    useEffect(() => {
        const userId = document.cookie.replace(/(?:(?:^|.*;\s*)userId\s*=\s*([^;]*).*$)|^.*$/, "$1");
        if (!userId) router.push('/')
        if (!id) return;

        const fetchSurvey = async () => {
            try {
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

        const fetchSurveyResponses = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:3000/api/answers/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch survey responses');
                }
                const data = await response.json();

                const responsesWithUserNames = await Promise.all(
                    data.map(async (response: any) => {
                        const userName = await fetchUserName(response.user_id);
                        return { ...response, userName };
                    })
                );

                setSurveyResponses(responsesWithUserNames);
            } catch (error) {
                console.error('Failed to fetch survey responses:', error);
            }
        };

        fetchSurvey();
        fetchSurveyResponses();
    }, [id]);

    const handleSubmitResponse = async () => {
        try {
            const userId = document.cookie.replace(/(?:(?:^|.*;\s*)userId\s*=\s*([^;]*).*$)|^.*$/, "$1");
            const response = await fetch('http://127.0.0.1:3000/api/answers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    survey_id: id,
                    user_id: userId,
                    answers: Object.keys(responses).map(questionId => ({
                        question_id: questionId,
                        answer: responses[questionId]
                    }))
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit response');
            }

            setShowResponseForm(false);
            alert('Response submitted successfully!');
        } catch (error) {
            console.error('Failed to submit response:', error);
            alert('Failed to submit response');
        }
    };

    if (!id) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-10 p-4">
            {/* Colonne des questions */}
            <div className="lg:col-span-2 space-y-8">
                {loading ? (
                    <div className="text-center text-lg text-gray-600">Loading survey details...</div>
                ) : survey ? (
                    <Card className="shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-t-lg flex justify-between items-center">
                            <CardTitle className="text-white text-2xl font-bold">
                                {survey.name}
                            </CardTitle>
                            <button
                                onClick={() => setShowResponseForm(true)}
                                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <MessageCircle className="text-blue-500" />
                            </button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {survey.questions.map((question, index) => (
                                <div key={index} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {question.title}
                                    </h3>
                                    {question.answers && (
                                        <ul className="space-y-4 pl-6">
                                            {question.answers.map((answer, idx) => (
                                                <li
                                                    key={idx}
                                                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                                >
                                                    {answer}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="text-center text-lg text-gray-600">Survey not found</div>
                )}

                <Dialog open={showResponseForm} onOpenChange={setShowResponseForm}>
                    <DialogContent className={'bg-white'}>
                        <DialogHeader>
                            <DialogTitle>Respond to Survey</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            {survey?.questions.map((question, index) => (
                                <div key={index} className="space-y-2">
                                    <label className="text-lg font-semibold">{question.title}</label>
                                    {question.type === 'open' ? (
                                        <Input
                                            type="text"
                                            onChange={(e) => setResponses({ ...responses, [question._id]: e.target.value })}
                                        />
                                    ) : (
                                        <div className="space-y-2">
                                            {question.answers?.map((answer, idx) => (
                                                <div key={idx} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        value={answer}
                                                        onChange={(e) => {
                                                            const selectedAnswers = responses[question._id] as string[] || [];
                                                            if (e.target.checked) {
                                                                setResponses({ ...responses, [question._id]: [...selectedAnswers, answer] });
                                                            } else {
                                                                setResponses({ ...responses, [question._id]: selectedAnswers.filter(a => a !== answer) });
                                                            }
                                                        }}
                                                    />
                                                    <label>{answer}</label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSubmitResponse}>Submit</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Colonne des réponses */}
            <div className="lg:col-span-1">
                <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-t-lg">
                        <CardTitle className="text-white text-2xl font-bold">
                            Responses
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {surveyResponses.length > 0 ? (
                            surveyResponses.map((response, index) => (
                                <div key={index} className="space-y-4">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        User: {response.userName}
                                    </h3>
                                    <ul className="space-y-2 pl-5">
                                        {response.answers.map((answer: any, idx: number) => (
                                            <li
                                                key={idx}
                                                className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                            >
                                                <strong>Q: {survey?.questions.find(q => q._id === answer.question_id)?.title}</strong>
                                                <br />
                                                A: {Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}
                                            </li>
                                        ))}
                                    </ul>
                                    {index < surveyResponses.length - 1 && (
                                        <hr className="border-t border-gray-200" />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-lg text-gray-600">No responses yet</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}