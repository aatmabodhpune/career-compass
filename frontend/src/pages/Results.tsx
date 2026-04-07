import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentStore } from '../store/assessmentStore';
import { useAlignmentStore } from '../store/alignmentStore';
import { formatScore } from '../utils/formatScore';
import type { CareerScore, CareerDetail, Recommendation } from '../types/alignment';
import { generateReport } from '../pdf/generateReport';
import { ReportTemplate } from '../pdf/reportTemplate';
import { Button } from '../components/ui/Button';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import { ProgressBar } from '../components/ui/ProgressBar';

// ─── Primitives ──────────────────────────────────────────────────────────────

function Empty() {
    return <p className="text-gray-400 text-sm italic">No data available.</p>;
}

function MatchBadge({ index }: { index: number }) {
    if (index === 0) {
        return (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-teal-600 text-white shadow-sm ring-4 ring-teal-50">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                Best Match
            </span>
        );
    }
    if (index === 1 || index === 2) {
        return (
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200/50">
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
        <Card className="hover:shadow-md transition-all duration-300 mb-6 border border-gray-100 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{careerName}</h3>
                        <MatchBadge index={index} />
                    </div>
                </div>
                <div className="flex items-baseline gap-1 sm:text-right">
                    <p className="text-4xl font-black text-teal-600">{formatScore(mainScore)}</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">%</p>
                </div>
            </div>

            <ProgressBar value={mainScore} />

            {subScores && subScores.length > 0 && (
                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-50">
                    {subScores.map((sub) => (
                        <div key={sub.label} className="bg-gray-50/50 p-3 sm:p-4 rounded-2xl border border-gray-100/50">
                            <p className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{sub.label}</p>
                            <p className="text-lg font-bold text-gray-700">{formatScore(sub.value)}</p>
                        </div>
                    ))}
                </div>
            )}
        </Card>
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
            <Container className="flex items-center justify-center min-h-screen">
                <Card className="text-center max-w-md w-full p-8 shadow-sm">
                    <p className="text-gray-600 font-medium">
                        Session not found. Please complete the assessment first.
                    </p>
                    <Button onClick={() => navigate("/dashboard")} className="mt-6 w-full">Back to Dashboard</Button>
                </Card>
            </Container>
        );
    }

    // ── Loading ──
    if (loading) {
        return (
            <Container className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-100 border-t-teal-600"></div>
                <div className="text-gray-600 font-bold tracking-wide">Compiling your comprehensive report...</div>
            </Container>
        );
    }

    // ── Error ──
    if (error) {
        return (
            <Container className="flex items-center justify-center min-h-screen">
                <Card className="text-center max-w-md w-full space-y-6 shadow-sm">
                    <div className="text-red-500 text-5xl">⚠️</div>
                    <h2 className="text-2xl font-black text-gray-900">Analysis Failed</h2>
                    <p className="text-gray-600">{error || "We couldn't load your alignment results."}</p>
                    <Button
                        onClick={() => fetchResults(session_id)}
                        className="w-full"
                    >
                        Retry Analysis
                    </Button>
                </Card>
            </Container>
        );
    }

    // ── No results ──
    if (!results) {
        return (
            <Container className="flex items-center justify-center min-h-screen">
                <Card className="text-center max-w-md w-full space-y-4 shadow-sm">
                    <p className="text-gray-600 font-medium">No results available yet.</p>
                    <Button onClick={() => navigate("/dashboard")} variant="outline" className="w-full">
                        Back to Dashboard
                    </Button>
                </Card>
            </Container>
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
        <Container className="py-12 space-y-16 animate-in fade-in duration-1000 max-w-5xl">
            <PageHeader 
                title="Your Career Alignment Report" 
                subtitle="A fully analyzed breakdown of your highest potential career paths based on your multi-dimensional profile."
                rightContent={
                    <Button variant="outline" onClick={() => navigate("/dashboard")} className="font-bold">
                        Return to Dashboard
                    </Button>
                }
            />

            {/* 1. Overall Top Careers */}
            <SectionWrapper 
                title="Career Alignment Summary"
                description="Your overall top matches synthesized from your personality, interests, and aptitude scores."
            >
                {overall.length === 0 ? <Empty /> : (
                    overall.map((item: CareerScore, index: number) => (
                        <CareerCard
                            key={`overall-${index}`}
                            careerName={item.career_name}
                            mainScore={item.final_score}
                            subScores={[
                                { label: 'Personality', value: item.personality_score },
                                { label: 'Interest', value: item.interest_score },
                                { label: 'Aptitude', value: item.aptitude_score },
                            ]}
                            index={index}
                        />
                    ))
                )}
            </SectionWrapper>

            <div className="w-full h-px bg-gray-200/50 my-16"></div>

            {/* 2. Alignment Sections */}
            <SectionWrapper 
                title="Personality Alignment"
                description="Careers strictly matching your behavioral patterns and workplace interaction style."
            >
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
            </SectionWrapper>

            <SectionWrapper 
                title="Interest Alignment"
                description="Careers matching the activities and subject matter you are naturally passionate about."
            >
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
            </SectionWrapper>

            <SectionWrapper 
                title="Aptitude Alignment"
                description="Careers that leverage your natural problem-solving abilities and cognitive strengths."
            >
                {aptitude.length === 0 ? <Empty /> : (
                    aptitude.every(item => item.aptitude_score === 0) ? (
                        <Card className="bg-orange-50/50 border border-orange-100 p-6 flex items-start gap-4 shadow-none">
                            <span className="text-2xl">⚡</span>
                            <div>
                                <h4 className="font-bold text-orange-900">Aptitude Module Isolated</h4>
                                <p className="text-sm text-orange-800/80 mt-1">Aptitude evaluation currently lacks sufficient baseline data to calculate meaningful independent alignment scores.</p>
                            </div>
                        </Card>
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
            </SectionWrapper>

            {/* 3. Insights */}
            <SectionWrapper 
                title="Deep Profile Insights"
                description="A breakdown of your core strengths, growth areas, and actionable next steps."
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-teal-50/30 border border-teal-100/50 p-6 sm:p-8 space-y-6 shadow-sm">
                            <h4 className="text-xs font-black text-teal-600 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                                Top Strengths
                            </h4>
                            {strengths.length === 0 ? <Empty /> : (
                                <ul className="space-y-4">
                                    {strengths.map((item: string, index: number) => (
                                        <li key={`strength-${index}`} className="flex items-start gap-3 text-sm font-medium text-gray-800 leading-relaxed">
                                            <span className="text-teal-500 font-bold shrink-0 mt-0.5">✓</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>

                        <Card className="bg-red-50/30 border border-red-100/50 p-6 sm:p-8 space-y-6 shadow-sm">
                            <h4 className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                Areas to Improve
                            </h4>
                            {weaknesses.length === 0 ? <Empty /> : (
                                <ul className="space-y-4">
                                    {weaknesses.map((item: string, index: number) => (
                                        <li key={`weakness-${index}`} className="flex items-start gap-3 text-sm font-medium text-gray-800 leading-relaxed">
                                            <span className="text-red-400 font-bold shrink-0 mt-0.5">↑</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>
                    </div>

                    <Card className="border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
                        <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            Targeted Recommendations
                        </h4>
                        {recommendations.length === 0 ? <Empty /> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {recommendations.map((item: Recommendation, index: number) => (
                                    <div key={`rec-${index}`} className="bg-gray-50/50 border-l-[3px] border-indigo-500 p-5 rounded-r-xl">
                                        <p className="text-sm font-black text-gray-900 mb-2">{item.area}</p>
                                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                            {item.suggestion}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </SectionWrapper>

            {/* 4. Career Details */}
            <SectionWrapper 
                title="Career Deep Dives"
                description="Granular examination of why your profile aligns with these specific roles."
            >
                {careerDetails.length === 0 ? <Empty /> : (
                    <div className="space-y-6">
                        {careerDetails.map((item: CareerDetail, index: number) => (
                            <Card key={`detail-${index}`} className="border border-gray-100 p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{item.career_name}</h3>
                                <p className="text-gray-600 text-base leading-relaxed font-medium">{item.explanation}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-gray-50">
                                    {(item.strengths_used ?? []).length > 0 && (
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 inline-block px-3 py-1 rounded-full">
                                                Leveraged Strengths
                                            </p>
                                            <ul className="space-y-2.5">
                                                {item.strengths_used.map((s: string, i: number) => (
                                                    <li key={`su-${index}-${i}`} className="text-sm font-medium text-gray-700 flex items-start gap-2.5">
                                                        <span className="w-1.5 h-1.5 shrink-0 mt-1.5 bg-teal-400 rounded-full" />
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {(item.improvement_areas ?? []).length > 0 && (
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 inline-block px-3 py-1 rounded-full">
                                                Actionable Gaps
                                            </p>
                                            <ul className="space-y-2.5">
                                                {item.improvement_areas.map((a: string, i: number) => (
                                                    <li key={`ia-${index}-${i}`} className="text-sm font-medium text-gray-700 flex items-start gap-2.5">
                                                        <span className="w-1.5 h-1.5 shrink-0 mt-1.5 bg-orange-400 rounded-full" />
                                                        {a}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </SectionWrapper>

            {/* 5. Download Actions */}
            <SectionWrapper>
                  <Card className="bg-gradient-to-br from-teal-600 to-teal-800 text-white p-8 sm:p-10 text-center space-y-6 flex flex-col items-center">
                       <h3 className="text-2xl font-black">Ready to take action?</h3>
                       <p className="text-teal-100 max-w-lg font-medium leading-relaxed">
                           Generate a comprehensive PDF analysis report of your profile for offline records, sharing with counselors, or long-term tracking.
                       </p>
                       <Button
                            onClick={() => generateReport("pdf-content")}
                            size="lg"
                            className="bg-white text-teal-900 hover:bg-teal-50 w-full sm:w-auto px-12"
                       >
                            Download Full PDF Report
                       </Button>
                  </Card>
            </SectionWrapper>

            {/* Hidden PDF Render Container */}
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

        </Container>
    );
}
