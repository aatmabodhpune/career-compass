import React from "react";

// ── Types aligned to new API contract ────────────────────────────────────────

type Career = {
  career_name: string;
  final_score: number;
  personality_score: number;
  interest_score: number;
  aptitude_score: number;
};

type AlignmentEntry = {
  career_name: string;
  personality_score: number;
  interest_score: number;
  aptitude_score: number;
};

type CareerDetail = {
  career_id: string;
  description: string;
  strengths: string[];
  improvements: string[];
};

type ReportProps = {
  careers: Career[];
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  personalityAlignment?: AlignmentEntry[];
  interestAlignment?: AlignmentEntry[];
  aptitudeAlignment?: AlignmentEntry[];
  careerDetails?: CareerDetail[];
};

export const ReportTemplate: React.FC<ReportProps> = ({
  careers,
  strengths,
  improvements,
  recommendations,
  personalityAlignment = [],
  interestAlignment = [],
  aptitudeAlignment = [],
  careerDetails = [],
}) => {
  const top5Careers = (careers || []).slice(0, 5);

  const colors = {
    primary: "#0D9488",
    light: "#F0FDFA",
    textPrimary: "#111827",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    bgGray: "#F9FAFB",
    white: "#FFFFFF",
  };

  const styles = {
    container: {
      padding: "40px",
      fontFamily: "Helvetica, Arial, sans-serif",
      color: colors.textPrimary,
      lineHeight: "1.5",
      backgroundColor: colors.white,
    },
    header: {
      marginBottom: "40px",
      borderBottom: `3px solid ${colors.primary}`,
      paddingBottom: "20px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold" as const,
      margin: "0 0 8px 0",
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: "16px",
      color: colors.textSecondary,
      margin: "0",
    },
    sectionTitle: {
      fontSize: "22px",
      fontWeight: "bold" as const,
      color: colors.textPrimary,
      marginBottom: "20px",
      marginTop: "40px",
      borderBottom: `1px solid ${colors.border}`,
      paddingBottom: "10px",
    },
    card: {
      backgroundColor: colors.white,
      border: `1px solid ${colors.border}`,
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "20px",
    },
    careerNameRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px",
    },
    careerName: {
      fontSize: "20px",
      fontWeight: "bold" as const,
      margin: "0",
    },
    matchScore: {
      fontSize: "24px",
      fontWeight: "bold" as const,
      color: colors.primary,
      margin: "0",
    },
    progressBarBg: {
      backgroundColor: "#E5E7EB",
      height: "10px",
      borderRadius: "5px",
      width: "100%",
      marginBottom: "15px",
    },
    progressBarFill: {
      backgroundColor: colors.primary,
      height: "100%",
      borderRadius: "5px",
    },
    statsRow: {
      display: "flex",
      gap: "20px",
      fontSize: "13px",
      color: colors.textSecondary,
    },
    statItem: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    statValue: {
      fontWeight: "bold" as const,
      color: colors.textPrimary,
    },
    divider: {
      borderLeft: `1px solid ${colors.border}`,
      height: "16px",
      margin: "0 5px",
    },
    subSectionTitle: {
      fontSize: "18px",
      fontWeight: "bold" as const,
      marginBottom: "12px",
      marginTop: "0",
      color: colors.textPrimary,
    },
    bulletList: {
      margin: "0 0 0 20px",
      padding: "0",
    },
    bulletItem: {
      marginBottom: "8px",
      fontSize: "14px",
      color: colors.textSecondary,
      lineHeight: "1.6",
    },
    alignmentRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: `1px solid ${colors.border}`,
      fontSize: "15px",
    },
  };

  const formatPercent = (val: number) => {
      const v = Number.isFinite(val) ? val : 0;
      return Math.round(Math.max(0, v) * 100);
  };

  return (
    <div style={styles.container}>
      {/* 1. HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>Your Career Report</h1>
        <p style={styles.subtitle}>
          Based on your personality, interests, and aptitude assessment
        </p>
      </div>

      {/* 2. TOP CAREERS */}
      <h2 style={styles.sectionTitle}>Top Career Matches</h2>
      {top5Careers.map((career, index) => (
        <div key={index} style={styles.card}>
          <div style={styles.careerNameRow}>
            <p style={styles.careerName}>{career.career_name}</p>
            <p style={styles.matchScore}>{formatPercent(career.final_score)}%</p>
          </div>
          
          <div style={styles.progressBarBg}>
            <div style={{ ...styles.progressBarFill, width: `${Math.min(100, formatPercent(career.final_score))}%` }} />
          </div>

          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <span>Personality:</span>
              <span style={styles.statValue}>{formatPercent(career.personality_score)}%</span>
            </div>
            <div style={styles.divider} />
            <div style={styles.statItem}>
              <span>Interest:</span>
              <span style={styles.statValue}>{formatPercent(career.interest_score)}%</span>
            </div>
            <div style={styles.divider} />
            <div style={styles.statItem}>
              <span>Aptitude:</span>
              <span style={styles.statValue}>{formatPercent(career.aptitude_score)}%</span>
            </div>
          </div>
        </div>
      ))}

      {/* 3. ALIGNMENT BREAKDOWNS */}
      {(personalityAlignment.length > 0 || interestAlignment.length > 0 || aptitudeAlignment.length > 0) && (
        <>
          <h2 style={styles.sectionTitle}>Alignment Breakdowns</h2>

          {personalityAlignment.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.subSectionTitle}>Personality Alignment</h3>
              {personalityAlignment.slice(0, 5).map((c, i) => (
                <div key={i} style={{ ...styles.alignmentRow, borderBottom: i === Math.min(personalityAlignment.length, 5) - 1 ? "none" : styles.alignmentRow.borderBottom }}>
                  <span style={{ fontWeight: "bold", color: colors.textSecondary }}>{c.career_name}</span>
                  <span style={styles.statValue}>{formatPercent(c.personality_score)}%</span>
                </div>
              ))}
            </div>
          )}

          {interestAlignment.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.subSectionTitle}>Interest Alignment</h3>
              {interestAlignment.slice(0, 5).map((c, i) => (
                <div key={i} style={{ ...styles.alignmentRow, borderBottom: i === Math.min(interestAlignment.length, 5) - 1 ? "none" : styles.alignmentRow.borderBottom }}>
                  <span style={{ fontWeight: "bold", color: colors.textSecondary }}>{c.career_name}</span>
                  <span style={styles.statValue}>{formatPercent(c.interest_score)}%</span>
                </div>
              ))}
            </div>
          )}

          {aptitudeAlignment.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.subSectionTitle}>Aptitude Alignment</h3>
              {aptitudeAlignment.slice(0, 5).map((c, i) => (
                <div key={i} style={{ ...styles.alignmentRow, borderBottom: i === Math.min(aptitudeAlignment.length, 5) - 1 ? "none" : styles.alignmentRow.borderBottom }}>
                  <span style={{ fontWeight: "bold", color: colors.textSecondary }}>{c.career_name}</span>
                  <span style={styles.statValue}>{formatPercent(c.aptitude_score)}%</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* 4. INSIGHTS */}
      <h2 style={styles.sectionTitle}>Profile Insights</h2>

      {strengths.length > 0 && (
        <div style={{ ...styles.card, borderLeft: `4px solid ${colors.primary}` }}>
          <h3 style={styles.subSectionTitle}>Strengths</h3>
          <ul style={styles.bulletList}>
            {strengths.map((s, i) => (
              <li key={i} style={styles.bulletItem}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {improvements.length > 0 && (
        <div style={{ ...styles.card, borderLeft: "4px solid #F87171" }}>
          <h3 style={styles.subSectionTitle}>Areas to Improve</h3>
          <ul style={styles.bulletList}>
            {improvements.map((w, i) => (
              <li key={i} style={styles.bulletItem}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {recommendations.length > 0 && (
        <div style={{ ...styles.card, borderLeft: "4px solid #818CF8" }}>
          <h3 style={styles.subSectionTitle}>Recommendations</h3>
          <ul style={styles.bulletList}>
            {recommendations.map((r, i) => (
              <li key={i} style={styles.bulletItem}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 5. CAREER DETAILS */}
      {careerDetails && careerDetails.length > 0 && (
        <>
          <h2 style={styles.sectionTitle}>Career Details</h2>
          {careerDetails.map((detail) => {
            const career = careers.find((c: any) => c.career_id === detail.career_id || (c as any).id === detail.career_id);
            const careerName = career ? career.career_name : "Career";

            return (
              <div key={detail.career_id} style={{ ...styles.card, marginBottom: "20px" }}>
                <h3 style={styles.subSectionTitle}>{careerName}</h3>
                
                {detail.description && (
                  <p style={{ ...styles.bulletItem, marginBottom: "12px", color: colors.textPrimary }}>
                    {detail.description}
                  </p>
                )}
                
                {detail.strengths && detail.strengths.length > 0 && (
                  <div style={{ marginBottom: "10px" }}>
                    <p style={{ fontSize: "14px", fontWeight: "bold", color: colors.primary, marginBottom: "4px" }}>Strengths</p>
                    <ul style={styles.bulletList}>
                      {detail.strengths.map((s, i) => (
                        <li key={i} style={styles.bulletItem}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {detail.improvements && detail.improvements.length > 0 && (
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "bold", color: "#F87171", marginBottom: "4px", marginTop: "10px" }}>Areas to Improve</p>
                    <ul style={styles.bulletList}>
                      {detail.improvements.map((imp, i) => (
                        <li key={i} style={styles.bulletItem}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
