import React from "react";

type Career = {
  career_name: string;
  match_score: number;
  personality_score: number;
  interest_score: number;
  aptitude_score: number;
};

type Insights = {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
};

type CareerDetail = {
  career_name: string;
  explanation: string;
  strengths: string[];
  weaknesses: string[];
};

type ReportProps = {
  careers: Career[];
  insights: Insights;
  details: CareerDetail[];
};

export const ReportTemplate: React.FC<ReportProps> = ({
  careers,
  insights,
  details,
}) => {
  const topCareers = careers.slice(0, 5);

  return (
    <div className="p-6 text-sm leading-snug">

      {/* HEADER */}
      <div className="mb-3">
        <h1 className="text-lg font-semibold">Your Career Matches</h1>
        <p className="text-xs text-gray-600">
          Based on your personality, interests, and aptitude assessment
        </p>
      </div>

      {/* SCORE EXPLANATION */}
      <div className="mb-3 text-xs text-gray-700">
        <p>Scores are based on:</p>
        <ul className="list-disc ml-4">
          <li>Personality (your traits)</li>
          <li>Interest (what you enjoy)</li>
          <li>Aptitude (your abilities)</li>
        </ul>
        <p className="mt-1">
          Higher scores indicate stronger alignment.
        </p>
      </div>

      {/* TOP CAREERS */}
      <div className="mb-3">
        <h2 className="font-semibold mb-1">Top Career Matches</h2>

        {topCareers.map((career, index) => (
          <div key={index} className="mb-2">

            <p className="font-medium">
              {career.career_name}
            </p>

            <p className="text-xs">
              Match Score: {Math.round(career.match_score)}
            </p>

            <p className="text-xs text-gray-600">
              Personality: {career.personality_score} | 
              Interest: {career.interest_score} | 
              Aptitude: {career.aptitude_score ?? 0}
            </p>

          </div>
        ))}
      </div>

      {/* INSIGHTS */}
      <div className="mb-3">
        <h2 className="font-semibold mb-1">Insights</h2>

        <p className="text-xs"><strong>Strengths:</strong></p>
        <ul className="list-disc ml-4 text-xs mb-2">
          {insights.strengths.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>

        <p className="text-xs"><strong>Areas to Improve:</strong></p>
        <ul className="list-disc ml-4 text-xs mb-2">
          {insights.weaknesses.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>

        <p className="text-xs"><strong>Recommendations:</strong></p>
        <ul className="list-disc ml-4 text-xs">
          {insights.recommendations.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>

      {/* CAREER DETAILS */}
      <div>
        <h2 className="font-semibold mb-1">Career Details</h2>

        {topCareers.map((career, index) => {
          const detail = details.find(
            (d) => d.career_name === career.career_name
          );

          if (!detail) return null;

          return (
            <div key={index} className="mb-2">

              <p className="font-medium text-xs">
                {detail.career_name}
              </p>

              <p className="text-xs text-gray-700">
                {detail.explanation}
              </p>

              <p className="text-xs">
                <strong>Strengths:</strong> {detail.strengths.join(", ")}
              </p>

              <p className="text-xs">
                <strong>Improve:</strong> {detail.weaknesses.join(", ")}
              </p>

            </div>
          );
        })}
      </div>

    </div>
  );
};
