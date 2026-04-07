import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentStore } from '../store/assessmentStore';
import { useAlignmentStore } from '../store/alignmentStore';
import { formatScore } from '../utils/formatScore';
import type { CareerScore, CareerDetail, Recommendation } from '../types/alignment';
import { generateReport } from '../pdf/generateReport';
import { ReportTemplate } from '../pdf/reportTemplate';
import { Button } from '../components/ui/Button';

// ─── Primitives ──────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h2>
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
            <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                Best Match
            </span>
        );
    }
    if (index === 1 || index === 2) {
        return (
            <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
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
        <div className="transform transition duration-200 hover:-translate-y-0.5 bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4 hover:shadow-md hover:border-blue-300 transition-all">
            <div className="flex items-start justify-between mb-1">
                <h3 className="text-xl font-semibold text-gray-900">{careerName}</h3>
                <MatchLabel index={index} />
            </div>
            <p className="text-3xl font-bold text-blue-600 mt-1">{formatScore(mainScore)}</p>
            <p className="text-xs text-gray-500 mb-2">Match Score</p>
            {subScores && subScores.length > 0 && (
                <div className="mt-3 text-sm text-gray-600 space-y-1 pt-3 border-t border-gray-100">
                    {subScores.map((sub) => (
                        <p key={sub.label}>
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
    const navigate = useNavigate();
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
            <div className="max-w-5xl mx-auto px-4 py-5 bg-gray-50 flex items-center justify-center min-h-screen">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
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
            <div className="max-w-5xl mx-auto px-4 py-5 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <div className="text-gray-600 font-medium">Analyzing your results...</div>
            </div>
        );
    }

    // ── Error ──
    if (error) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-5 bg-gray-50 flex items-center justify-center min-h-screen">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center max-w-md w-full">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error || "We couldn't load your alignment results."}</p>
                    <Button
                        onClick={() => fetchResults(session_id)}
                        className="w-full justify-center"
                    >
                        Retry Analysis
                    </Button>
                </div>
            </div>
        );
    }

    // ── No results ──
    if (!results) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-5 bg-gray-50 flex items-center justify-center min-h-screen">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center max-w-md w-full">
                    <p className="text-gray-600 font-medium mb-4">No results available yet.</p>
                    <Button onClick={() => navigate("/dashboard")} variant="secondary" className="w-full justify-center">
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    // ── Defensive defaults ──
    const overall = results.overall_top_10 ?? [];
    const personality = results.personality_top_10 ?? [];
    const interest = results.interest_top_10 ?? [];
    const aptitude = results.aptitude_top_10 ?? [];
    const strengths = results.insights?.strengths ?? [];
    const weaknesses = results.insights?.weaknesses ?? [];
    const recommendations = results.insights?.recommendations ?? [];
    const careerDetails = results.career_details ?? [];

    return (
        <div className="max-w-5xl mx-auto px-4 py-5 bg-gray-50 min-h-screen">

            {/* Page Header */}
            <div className="mb-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Your Career Matches
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Based on your personality, interests, and aptitude assessment
                </p>
            </div>

            {/* 1. Overall Top Careers */}
            <Section title="Overall Top Careers">
                <p className="text-xs text-gray-400 mb-4">Higher score indicates better alignment.</p>
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
                <div className="space-y-5">
                    <div>
                        <h4 className="text-sm font-semibold text-green-600 mb-2">Strengths</h4>
                        {strengths.length === 0 ? <Empty /> : (
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {strengths.map((item: string, index: number) => (
                                    <li key={`strength-${index}`} className="text-sm">{item}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-red-600 mb-2">Areas to Improve</h4>
                        {weaknesses.length === 0 ? <Empty /> : (
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {weaknesses.map((item: string, index: number) => (
                                    <li key={`weakness-${index}`} className="text-sm">{item}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-blue-600 mb-2">Recommendations</h4>
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
                </div>
            </Section>

            {/* 6. Career Details */}
            <Section title="Career Details">
                {careerDetails.length === 0 ? <Empty /> : (
                    <div className="space-y-5">
                        {careerDetails.map((item: CareerDetail, index: number) => (
                            <div
                                key={`detail-${index}`}
                                className="border-b border-gray-200 pb-5 last:border-0 last:pb-0"
                            >
                                <p className="font-bold text-gray-900 text-xl mb-2">{item.career_name}</p>
                                <p className="text-gray-700 text-base leading-relaxed mb-4">{item.explanation}</p>

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

            {/* 7. Report Download Actions */}
            <Section title="Report">
                 <button
                      onClick={() => generateReport("pdf-content")}
                      className="block w-full text-center mt-2 mb-2 bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 transition"
                 >
                      Download Full Report
                 </button>
                 <p className="text-center text-xs text-gray-400 mt-2">Generate a local PDF version of your results.</p>
            </Section>

            {/* Hidden PDF Render Container configured specifically for html2canvas */}
            <div className="absolute left-[-9999px] top-[-9999px] w-[800px] bg-white">
                <div id="pdf-content">
                    <ReportTemplate
                        careers={overall.map((c: any) => ({
                            career_name: c.career_name,
                            match_score: c.final_score,
                            personality_score: c.personality_score,
                            interest_score: c.interest_score,
                            aptitude_score: c.aptitude_score,
                        }))}
                        insights={{
                            strengths: strengths,
                            weaknesses: weaknesses,
                            recommendations: recommendations.map((r: any) => r.suggestion),
                        }}
                        details={careerDetails.map((d: any) => ({
                            career_name: d.career_name,
                            explanation: d.explanation,
                            strengths: d.strengths_used ?? [],
                            weaknesses: d.improvement_areas ?? [],
                        }))}
                    />
                </div>
            </div>

        </div>
    );
}
