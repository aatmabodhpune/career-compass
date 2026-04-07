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
      fontWeight: "bold",
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
      fontWeight: "bold",
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
      fontWeight: "bold",
      margin: "0",
    },
    matchScore: {
      fontSize: "24px",
      fontWeight: "bold",
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
      fontWeight: "bold",
      color: colors.textPrimary,
    },
    divider: {
      borderLeft: `1px solid ${colors.border}`,
      height: "16px",
      margin: "0 5px",
    },
    subSectionTitle: {
      fontSize: "18px",
      fontWeight: "bold",
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
    detailName: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "10px",
      color: colors.textPrimary,
      marginTop: 0,
    },
    detailDesc: {
      fontSize: "15px",
      color: colors.textSecondary,
      marginBottom: "15px",
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
      {topCareers.map((career, index) => (
        <div key={index} style={styles.card}>
          <div style={styles.careerNameRow}>
            <p style={styles.careerName}>{career.career_name}</p>
            <p style={styles.matchScore}>{Math.round(career.match_score)}%</p>
          </div>
          
          <div style={styles.progressBarBg}>
            <div style={{ ...styles.progressBarFill, width: `${Math.round(Math.max(0, Math.min(100, career.match_score)))}%` }} />
          </div>

          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <span>Personality:</span>
              <span style={styles.statValue}>{Math.round(career.personality_score)}%</span>
            </div>
            <div style={styles.divider} />
            <div style={styles.statItem}>
              <span>Interest:</span>
              <span style={styles.statValue}>{Math.round(career.interest_score)}%</span>
            </div>
            <div style={styles.divider} />
            <div style={styles.statItem}>
              <span>Aptitude:</span>
              <span style={styles.statValue}>{Math.round(career.aptitude_score ?? 0)}%</span>
            </div>
          </div>
        </div>
      ))}

      {/* 3. ALIGNMENT SECTIONS */}
      <h2 style={styles.sectionTitle}>Alignment Breakdowns</h2>
      
      <div style={styles.card}>
        <h3 style={styles.subSectionTitle}>Personality Alignment</h3>
        {topCareers.map((c, i) => (
            <div key={i} style={{...styles.alignmentRow, borderBottom: i === topCareers.length - 1 ? "none" : styles.alignmentRow.borderBottom}}>
                <span style={{ fontWeight: "bold", color: colors.textSecondary }}>{c.career_name}</span>
                <span style={styles.statValue}>{Math.round(c.personality_score)}%</span>
            </div>
        ))}
      </div>

      <div style={styles.card}>
        <h3 style={styles.subSectionTitle}>Interest Alignment</h3>
        {topCareers.map((c, i) => (
            <div key={i} style={{...styles.alignmentRow, borderBottom: i === topCareers.length - 1 ? "none" : styles.alignmentRow.borderBottom}}>
                <span style={{ fontWeight: "bold", color: colors.textSecondary }}>{c.career_name}</span>
                <span style={styles.statValue}>{Math.round(c.interest_score)}%</span>
            </div>
        ))}
      </div>

      <div style={styles.card}>
        <h3 style={styles.subSectionTitle}>Aptitude Alignment</h3>
        {topCareers.map((c, i) => (
            <div key={i} style={{...styles.alignmentRow, borderBottom: i === topCareers.length - 1 ? "none" : styles.alignmentRow.borderBottom}}>
                <span style={{ fontWeight: "bold", color: colors.textSecondary }}>{c.career_name}</span>
                <span style={styles.statValue}>{Math.round(c.aptitude_score ?? 0)}%</span>
            </div>
        ))}
      </div>

      {/* 4. INSIGHTS */}
      <h2 style={styles.sectionTitle}>Profile Insights</h2>
      
      <div style={{...styles.card, borderLeft: `4px solid ${colors.primary}`}}>
        <h3 style={styles.subSectionTitle}>Strengths</h3>
        <ul style={styles.bulletList}>
          {insights.strengths.map((s, i) => (
            <li key={i} style={styles.bulletItem}>{s}</li>
          ))}
        </ul>
      </div>

      <div style={{...styles.card, borderLeft: '4px solid #F87171'}}>
        <h3 style={styles.subSectionTitle}>Areas to Improve</h3>
        <ul style={styles.bulletList}>
          {insights.weaknesses.map((w, i) => (
            <li key={i} style={styles.bulletItem}>{w}</li>
          ))}
        </ul>
      </div>

      <div style={{...styles.card, borderLeft: '4px solid #818CF8'}}>
        <h3 style={styles.subSectionTitle}>Recommendations</h3>
        <ul style={styles.bulletList}>
          {insights.recommendations.map((r, i) => (
            <li key={i} style={styles.bulletItem}>{r}</li>
          ))}
        </ul>
      </div>

      {/* 5. CAREER DETAILS */}
      <h2 style={styles.sectionTitle}>Career Deep Dives</h2>
      {topCareers.map((career, index) => {
        const detail = details.find((d) => d.career_name === career.career_name);
        if (!detail) return null;

        return (
          <div key={index} style={{...styles.card}}>
            <h3 style={styles.detailName}>{detail.career_name}</h3>
            <p style={styles.detailDesc}>{detail.explanation}</p>
            
            {(detail.strengths?.length > 0) && (
                <div style={{ marginBottom: "15px" }}>
                  <strong style={{ fontSize: "14px", color: colors.textPrimary }}>Strengths Utilized:</strong>
                  <ul style={{ ...styles.bulletList, marginTop: "8px" }}>
                    {detail.strengths.map((s, i) => (
                      <li key={i} style={styles.bulletItem}>{s}</li>
                    ))}
                  </ul>
                </div>
            )}
            
            {(detail.weaknesses?.length > 0) && (
                <div>
                  <strong style={{ fontSize: "14px", color: colors.textPrimary }}>Improvement Opportunities:</strong>
                  <ul style={{ ...styles.bulletList, marginTop: "8px" }}>
                    {detail.weaknesses.map((w, i) => (
                      <li key={i} style={styles.bulletItem}>{w}</li>
                    ))}
                  </ul>
                </div>
            )}
          </div>
        );
      })}

    </div>
  );
};
