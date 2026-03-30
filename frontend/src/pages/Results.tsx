import React, { useEffect } from 'react';
import { useAssessmentStore } from '../store/assessmentStore';
import { useAlignmentStore } from '../store/alignmentStore';
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

// ─── Career Card (explicit values only — no dynamic field access) ─────────────

function CareerCard({ careerId, score }: { careerId: string; score: number }) {
    return (
        <div className="border border-gray-100 rounded-lg p-4 mb-3">
            <p className="font-bold text-gray-900 text-sm">{careerId}</p>
            <p className="text-gray-500 text-sm mt-1">{score}</p>
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
            <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50 flex items-center justify-center min-h-screen">
                <div className="bg-white rounded-xl shadow-md p-10 text-center">
                    <p className="text-gray-700 font-semibold text-lg mb-2">
                        Generating your results...
                    </p>
                    <p className="text-gray-400 text-sm">
                        This may take a few moments.
                    </p>
                </div>
            </div>
        );
    }

    // ── Error ──
    if (error) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-sm font-semibold text-red-500 mb-1">Something went wrong</p>
                    <p className="text-gray-600 text-sm">{error}</p>
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
                {overall.length === 0 ? <Empty /> : (
                    overall.map((item: CareerScore, index: number) => (
                        <CareerCard
                            key={`overall-${index}`}
                            careerId={item.career_id}
                            score={item.final_score}
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
                            careerId={item.career_id}
                            score={item.personality_score}
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
                            careerId={item.career_id}
                            score={item.interest_score}
                        />
                    ))
                )}
            </Section>

            {/* 4. Aptitude Matches */}
            <Section title="Aptitude Matches">
                {aptitude.length === 0 ? <Empty /> : (
                    aptitude.map((item: CareerScore, index: number) => (
                        <CareerCard
                            key={`aptitude-${index}`}
                            careerId={item.career_id}
                            score={item.aptitude_score}
                        />
                    ))
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
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        Recommendations
                    </h3>
                    {recommendations.length === 0 ? <Empty /> : (
                        <div className="space-y-3">
                            {recommendations.map((item: Recommendation, index: number) => (
                                <div key={`rec-${index}`} className="border-l-2 border-gray-200 pl-4">
                                    <p className="text-sm font-semibold text-gray-700">{item.area}</p>
                                    <p className="text-sm text-gray-500 mt-0.5">{item.suggestion}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </Section>

            {/* 6. Career Details */}
            <Section title="Career Details">
                {careerDetails.length === 0 ? <Empty /> : (
                    <div className="space-y-6">
                        {careerDetails.map((item: CareerDetail, index: number) => (
                            <div
                                key={`detail-${index}`}
                                className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                            >
                                <p className="font-bold text-gray-900 text-base mb-2">{item.career_id}</p>
                                <p className="text-gray-600 text-sm mb-4">{item.explanation}</p>

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
                </Section>
            )}

        </div>
    );
}
