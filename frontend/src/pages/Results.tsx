import React, { useEffect, useState } from 'react';
import { useAssessmentStore } from '../store/assessmentStore';
import { useAlignmentStore } from '../store/alignmentStore';
import { fetchCareersMap } from '../api/careers';

export default function Results() {
  const { session_id } = useAssessmentStore();
  const { results, loading, error, fetchResults } = useAlignmentStore();
  const [careerMap, setCareerMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (session_id) {
      fetchResults(session_id);
    }
  }, [session_id, fetchResults]);

  useEffect(() => {
    async function loadCareers() {
      const map = await fetchCareersMap();
      setCareerMap(map);
    }
    loadCareers();
  }, []);

  if (!session_id) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50 flex items-center justify-center min-h-screen">
        <p className="text-gray-600 font-medium">Session not found. Please complete the assessment.</p>
      </div>
    );
  }

  if (loading === true) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50 flex items-center justify-center min-h-screen">
        <p className="text-gray-600 font-medium text-center">Generating your results...</p>
      </div>
    );
  }

  if (error !== null) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  if (!results?.data) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50 flex items-center justify-center min-h-screen">
        <p className="text-gray-600 font-medium">No results available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      
      {results?.data?.overall_top_10 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Top Career Matches</h2>
          <div>
            {results.data.overall_top_10.map((item: any, index: number) => (
              <div key={index} className="flex justify-between border-b py-2 text-gray-800">
                <span>#{index + 1} {careerMap[item.career_id] || "Unknown Career"}</span>
                <span className="font-semibold">{Math.max(0, Math.round(Math.abs(item.final_score)))}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {results?.data?.personality_top_10 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Personality Matches</h2>
          <div>
            {results.data.personality_top_10.map((item: any, index: number) => (
              <div key={index} className="flex justify-between border-b py-2 text-gray-800">
                <span>#{index + 1} {careerMap[item.career_id] || "Unknown Career"}</span>
                <span className="font-semibold">{Math.max(0, Math.round(Math.abs(item.personality_score)))}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {results?.data?.interest_top_10 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Interest Matches</h2>
          <div>
            {results.data.interest_top_10.map((item: any, index: number) => (
              <div key={index} className="flex justify-between border-b py-2 text-gray-800">
                <span>#{index + 1} {careerMap[item.career_id] || "Unknown Career"}</span>
                <span className="font-semibold">{Math.max(0, Math.round(Math.abs(item.interest_score)))}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {results?.data?.aptitude_top_10 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Aptitude Matches</h2>
          <div>
            {results.data.aptitude_top_10.map((item: any, index: number) => (
              <div key={index} className="flex justify-between border-b py-2 text-gray-800">
                <span>#{index + 1} {careerMap[item.career_id] || "Unknown Career"}</span>
                <span className="font-semibold">{Math.max(0, Math.round(Math.abs(item.aptitude_score)))}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
