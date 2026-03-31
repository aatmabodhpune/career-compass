import React, { useEffect } from 'react';
import { useAssessmentStore } from '../store/assessmentStore';
import { useAlignmentStore } from '../store/alignmentStore';
import { formatScore } from '../utils/formatScore';
import type { CareerScore, CareerDetail, Recommendation } from '../types/alignment';

// ─── Primitives ──────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
            {children}
        </div>
    );
}

function Empty() {
    return <p className="text-gray-400 text-sm">No data available.</p>;
}

function MatchLabel({ index }: { index: number }) {
    if (index === 0) {
        return (
            <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                Best Match
            </span>
        );
    }
    if (index === 1 || index === 2) {
        return (
            <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                Strong Fit
            </span>
        );
    }
    return null;
}

// ─── Career Card ─────────────────────────────────────────────────────────────

function CareerCard({
    careerName,
    mainScore,
    subScores,
    index,
}: {
    careerName: string;
    mainScore: number;
    subScores?: { label: string; value: number }[];
    index: number;
}) {
    return (
        <div className="border border-gray-100 rounded-lg p-5 mb-4 shadow-sm hover:shadow-md transition-shadow bg-white">
            <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-gray-900 text-lg">{careerName}</p>
                <MatchLabel index={index} />
            </div>
            <p className="text-blue-600 font-semibold text-lg mb-1">Match Score: {formatScore(mainScore)}</p>
            {subScores && subScores.length > 0 && (
                <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-gray-50">
                    {subScores.map((sub) => (
                        <p key={sub.label} className="text-sm text-gray-500">
                            <span className="font-medium text-gray-700">{sub.label}:</span> {formatScore(sub.value)}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Results Page ────────────────────────────────────────────────────────────

export default function Results() {
    const { session_id } = useAssessmentStore();
    const { results, loading, error, fetchResults } = useAlignmentStore();

    useEffect(() => {
        if (session_id) {
            fetchResults(session_id);
        }
    }, [session_id]);

    // ── No session ──
    if (!session_id) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50 flex items-center justify-center min-h-screen">
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <p className="text-gray-600 font-medium">
                        Session not found. Please complete the assessment first.
                    </p>
                </div>
            </div>
        );
    }

    // ── Loading ──
    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Error ──
    if (error) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-sm font-semibold text-red-500 mb-2">Something went wrong</p>
                    <p className="text-gray-600 text-sm mb-4">{error}</p>
                    <button
                        onClick={() => fetchResults(session_id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // ── No results ──
    if (!results) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50 flex items-center justify-center min-h-screen">
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <p className="text-gray-600 font-medium">No results available yet.</p>
                </div>
            </div>
        );
    }

    // ── Defensive defaults for partial data ──
    const overall = results.overall_top_10 ?? [];
    const personality = results.personality_top_10 ?? [];
    const interest = results.interest_top_10 ?? [];
    const aptitude = results.aptitude_top_10 ?? [];
    const strengths = results.insights?.strengths ?? [];
    const weaknesses = results.insights?.weaknesses ?? [];
    const recommendations = results.insights?.recommendations ?? [];
    const careerDetails = results.career_details ?? [];
    const reportUrl = results.report?.url ?? null;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">

            {/* 1. Overall Top Careers */}
            <Section title="Overall Top Careers">
                <p className="text-sm text-gray-500 mb-4 tracking-tight">Higher score indicates better alignment.</p>
                {overall.length === 0 ? <Empty /> : (
                    overall.map((item: CareerScore, index: number) => (
                        <CareerCard
                            key={`overall-${index}`}
                            careerName={item.career_name}
                            mainScore={item.final_score}
                            subScores={[
                                { label: 'Personality Score', value: item.personality_score },
                                { label: 'Interest Score', value: item.interest_score },
                                { label: 'Aptitude Score', value: item.aptitude_score },
                            ]}
                            index={index}
                        />
                    ))
                )}
            </Section>

            {/* 2. Personality Matches */}
            <Section title="Personality Matches">
                {personality.length === 0 ? <Empty /> : (
                    personality.map((item: CareerScore, index: number) => (
                        <CareerCard
                            key={`personality-${index}`}
                            careerName={item.career_name}
                            mainScore={item.personality_score}
                            index={index}
                        />
                    ))
                )}
            </Section>

            {/* 3. Interest Matches */}
            <Section title="Interest Matches">
                {interest.length === 0 ? <Empty /> : (
                    interest.map((item: CareerScore, index: number) => (
                        <CareerCard
                            key={`interest-${index}`}
                            careerName={item.career_name}
                            mainScore={item.interest_score}
                            index={index}
                        />
                    ))
                )}
            </Section>

            {/* 4. Aptitude Matches */}
            <Section title="Aptitude Matches">
                {aptitude.length === 0 ? <Empty /> : (
                    aptitude.every(item => item.aptitude_score === 0) ? (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-sm text-yellow-800">
                            Aptitude evaluation is currently limited based on available inputs.
                        </div>
                    ) : (
                        aptitude.map((item: CareerScore, index: number) => (
                            <CareerCard
                                key={`aptitude-${index}`}
                                careerName={item.career_name}
                                mainScore={item.aptitude_score}
                                index={index}
                            />
                        ))
                    )
                )}
            </Section>

            {/* 5. Insights */}
            <Section title="Insights">

                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        Strengths
                    </h3>
                    {strengths.length === 0 ? <Empty /> : (
                        <ul className="list-disc list-inside space-y-1">
                            {strengths.map((item: string, index: number) => (
                                <li key={`strength-${index}`} className="text-gray-600 text-sm">{item}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        Weaknesses
                    </h3>
                    {weaknesses.length === 0 ? <Empty /> : (
                        <ul className="list-disc list-inside space-y-1">
                            {weaknesses.map((item: string, index: number) => (
                                <li key={`weakness-${index}`} className="text-gray-600 text-sm">{item}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                        Recommendations
                    </h3>
                    {recommendations.length === 0 ? <Empty /> : (
                        <div className="space-y-4">
                            {recommendations.map((item: Recommendation, index: number) => (
                                <div key={`rec-${index}`} className="border-l-2 border-blue-200 pl-4 py-1">
                                    <p className="text-sm font-semibold text-gray-800 mb-1">{item.area}</p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium text-gray-700">To improve your fit:</span> {item.suggestion}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </Section>

            {/* 6. Career Details */}
            <Section title="Career Details">
                {careerDetails.length === 0 ? <Empty /> : (
                    <div className="space-y-8">
                        {careerDetails.map((item: CareerDetail, index: number) => (
                            <div
                                key={`detail-${index}`}
                                className="border-b border-gray-200 pb-8 last:border-0 last:pb-0"
                            >
                                <p className="font-bold text-gray-900 text-xl mb-3">{item.career_name}</p>
                                <p className="text-gray-700 text-base leading-relaxed mb-5">{item.explanation}</p>

                                {(item.strengths_used ?? []).length > 0 && (
                                    <div className="mb-3">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                            Strengths Used
                                        </p>
                                        <ul className="list-disc list-inside space-y-0.5">
                                            {item.strengths_used.map((s: string, i: number) => (
                                                <li key={`su-${index}-${i}`} className="text-sm text-gray-600">{s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {(item.improvement_areas ?? []).length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                            Improvement Areas
                                        </p>
                                        <ul className="list-disc list-inside space-y-0.5">
                                            {item.improvement_areas.map((a: string, i: number) => (
                                                <li key={`ia-${index}-${i}`} className="text-sm text-gray-600">{a}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Section>

            {/* 7. Report — only when url is non-null */}
            {reportUrl && (
                <Section title="Report">
                    <a
                        href={reportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Download Report
                    </a>
                    <p className="text-xs text-gray-400 mt-2">Link may expire. Download promptly.</p>
                </Section>
            )}

        </div>
    );
}
