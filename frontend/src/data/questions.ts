export interface Question {
    id: string;
    section: 'personality' | 'interest' | 'aptitude';
    type: 'likert' | 'mcq';
    question: string;
    options: (number | string)[];
    category?: string;
    image?: string;
}

export const questions: Question[] = [
    // PERSONALITY
    ...[
        "I am the life of the party.",
        "I feel little concern for others.",
        "I am always prepared.",
        "I get stressed out easily.",
        "I have a rich vocabulary."
    ].map((text, i) => ({
        id: `p${i + 1}`,
        section: "personality" as const,
        type: "likert" as const,
        question: text,
        options: [1, 2, 3, 4, 5]
    })),

    // INTEREST (RIASEC Model) - Restored Integrity
    ...[
        { q: "Build kitchen cabinets", cat: "R" },
        { q: "Develop a new medicine", cat: "I" },
        { q: "Write books or plays", cat: "A" },
        { q: "Teach an individual an exercise routine", cat: "S" },
        { q: "Buy and sell stocks and bonds", cat: "E" }
    ].map((item, i) => ({
        id: `i${i + 1}`,
        section: "interest" as const,
        category: item.cat,
        type: "likert" as const,
        question: item.q,
        options: [1, 2, 3, 4, 5]
    })),


    // APTITUDE
    ...[
        { text: "What comes next in the sequence? 32, ? , 48, 56", image: false },
        { text: "Complete the numerical pattern in the grid.", image: true },
        { text: "Find the missing number in the sequence.", image: false },
        { text: "At a grocery store grapes cost 30 cents per ounce. Riya buys grapes and ends up paying $3.60. How many ounces did she buy?", image: false },
        { text: "If the temperature decreases by 2 degrees per 1000 feet of gained altitude and if the temperature at sea level is 25 degrees, what would be the temperature at 35,000 feet?", image: false }
    ].map((item, i) => ({
        id: `a${i + 1}`,
        section: "aptitude" as const,
        type: "mcq" as const,
        question: item.text,
        options: ["A", "B", "C", "D"],
        ...(item.image ? { image: `aptitude_q${i + 1}` } : {})
    }))
];

// DERIVED HELPERS
export const personalityQuestions = questions.filter(q => q.section === "personality");
export const interestQuestions = questions.filter(q => q.section === "interest");
export const aptitudeQuestions = questions.filter(q => q.section === "aptitude");

// COUNTS
export const TOTAL_PERSONALITY = personalityQuestions.length;
export const TOTAL_INTEREST = interestQuestions.length;
export const TOTAL_APTITUDE = aptitudeQuestions.length;
export const TOTAL_QUESTIONS = TOTAL_PERSONALITY + TOTAL_INTEREST + TOTAL_APTITUDE;
