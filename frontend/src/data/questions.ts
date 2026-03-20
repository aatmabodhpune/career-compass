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
        "I have a rich vocabulary.",
        "I don't talk a lot.",
        "I am interested in people.",
        "I leave my belongings around.",
        "I am relaxed most of the time.",
        "I have difficulty understanding abstract ideas.",
        "I feel comfortable around people.",
        "I insult people.",
        "I pay attention to details.",
        "I worry about things.",
        "I have a vivid imagination.",
        "I keep in the background.",
        "I sympathize with others' feelings.",
        "I make a mess of things.",
        "I seldom feel blue.",
        "I am not interested in abstract ideas.",
        "I start conversations.",
        "I am not interested in other people's problems.",
        "I get chores done right away.",
        "I am easily disturbed.",
        "I have excellent ideas.",
        "I have little to say.",
        "I have a soft heart.",
        "I often forget to put things back in their proper place.",
        "I get upset easily.",
        "I do not have a good imagination.",
        "I talk to a lot of different people at parties.",
        "I am not really interested in others.",
        "I like order.",
        "I change my mood a lot.",
        "I am quick to understand things.",
        "I don't like to draw attention to myself.",
        "I take time out for others.",
        "I shirk my duties.",
        "I have frequent mood swings.",
        "I use difficult words.",
        "I don't mind being the center of attention.",
        "I feel others' emotions.",
        "I follow a schedule.",
        "I get irritated easily.",
        "I spend time reflecting on things.",
        "I am quiet around strangers.",
        "I make people feel at ease.",
        "I am exacting in my work.",
        "I often feel blue.",
        "I am full of ideas."
    ].map((text, i) => ({
        id: `p${i + 1}`,
        section: "personality" as const,
        type: "likert" as const,
        question: text,
        options: [1, 2, 3, 4, 5]
    })),

    // INTEREST: R
    ...[
        "Build kitchen cabinets",
        "Drive a truck to deliver packages to offices and homes",
        "Lay brick or tile",
        "Test the quality of parts before shipment",
        "Repair household appliances",
        "Repair and install locks",
        "Raise fish in a fish hatchery",
        "Set up and operate machines to make products",
        "Assemble electronic parts",
        "Put out forest fires"
    ].map((text, i) => ({
        id: `i${i + 1}`,
        section: "interest" as const,
        category: "R",
        type: "likert" as const,
        question: text,
        options: [1, 2, 3, 4, 5]
    })),

    // INTEREST: I
    ...[
        "Develop a new medicine",
        "Investigate the cause of a fire",
        "Study ways to reduce water pollution",
        "Develop a way to better predict the weather",
        "Conduct chemical experiments",
        "Work in a biology lab",
        "Study the movement of planets",
        "Invent a replacement for sugar",
        "Examine blood samples using a microscope",
        "Do laboratory tests to identify diseases"
    ].map((text, i) => ({
        id: `i${i + 11}`,
        section: "interest" as const,
        category: "I",
        type: "likert" as const,
        question: text,
        options: [1, 2, 3, 4, 5]
    })),

    // INTEREST: A
    ...[
        "Write books or plays",
        "Paint sets for plays",
        "Play a musical instrument",
        "Write scripts for movies or television shows",
        "Compose or arrange music",
        "Perform jazz or tap dance",
        "Draw pictures",
        "Sing in a band",
        "Create special effects for movies",
        "Edit movies"
    ].map((text, i) => ({
        id: `i${i + 21}`,
        section: "interest" as const,
        category: "A",
        type: "likert" as const,
        question: text,
        options: [1, 2, 3, 4, 5]
    })),

    // INTEREST: S
    ...[
        "Teach an individual an exercise routine",
        "Teach children how to play sports",
        "Help people with personal or emotional problems",
        "Teach sign language to people who are deaf or hard of hearing",
        "Give career guidance to people",
        "Help conduct a group therapy session",
        "Perform rehabilitation therapy",
        "Take care of children at a day-care center",
        "Do volunteer work at a non-profit organization",
        "Teach a high-school class"
    ].map((text, i) => ({
        id: `i${i + 31}`,
        section: "interest" as const,
        category: "S",
        type: "likert" as const,
        question: text,
        options: [1, 2, 3, 4, 5]
    })),

    // INTEREST: E
    ...[
        "Buy and sell stocks and bonds",
        "Negotiate business contracts",
        "Manage a retail store",
        "Represent a client in a lawsuit",
        "Operate a beauty salon or barber shop",
        "Market a new line of clothing",
        "Manage a department within a large company",
        "Sell merchandise at a department store",
        "Start your own business",
        "Manage a clothing store"
    ].map((text, i) => ({
        id: `i${i + 41}`,
        section: "interest" as const,
        category: "E",
        type: "likert" as const,
        question: text,
        options: [1, 2, 3, 4, 5]
    })),

    // INTEREST: C
    ...[
        "Develop a spreadsheet using computer software",
        "Calculate the wages of employees",
        "Proofread records or forms",
        "Inventory supplies using a hand-held computer",
        "Install software across computers on a large network",
        "Record rent payments",
        "Operate a calculator",
        "Keep inventory records",
        "Keep shipping and receiving records",
        "Stamp, sort, and distribute mail for an organization"
    ].map((text, i) => ({
        id: `i${i + 51}`,
        section: "interest" as const,
        category: "C",
        type: "likert" as const,
        question: text,
        options: [1, 2, 3, 4, 5]
    })),

    // APTITUDE
    ...[
        { text: "What comes next in the sequence? 32, ? , 48, 56", image: false },
        { text: "Complete the numerical pattern in the grid.", image: true },
        { text: "Find the missing number in the sequence.", image: false },
        { text: "At a grocery store grapes cost 30 cents per ounce. Riya buys grapes and ends up paying $3.60. How many ounces did she buy?", image: false },
        { text: "If the temperature decreases by 2 degrees per 1000 feet of gained altitude and if the temperature at sea level is 25 degrees, what would be the temperature at 35,000 feet?", image: false },
        { text: "The year is 2012, Darshan is the oldest and will turn 25 in the year of 2015. Rohan is half the age of Darshan and Ram is four years older than Rohan. How old will Rohan be in 2015?", image: false },
        { text: "Work is to money as study is to ________", image: false },
        { text: "Genius is to dunce as destroy is to ________", image: false },
        { text: "Rotor, Radar, Kayak, Noon. Which of the words DOES belong to list of words above", image: false },
        { text: "1. Pooja is taller than Gayatri and shorter than Lata. 2. Komal is shorter than Lata and taller than Pooja. 3. Gayatri is taller than Komal. If the first two statements are true the third statement is", image: false },
        { text: "Five cars are ready at the start line of a race. Car B is positioned to the right of Car A but is not positioned next to Car C and Car C is positioned next to Car D which has Car B on its left side. Car E is positioned furthest from Car C. Which car does not have a car to the left of it?", image: false },
        { text: "Select a suitable option that would complete the figure matrix.", image: true },
        { text: "Which figure completes the series? (Box containing horizontal lines and circles)", image: true },
        { text: "Select a suitable option that would complete the figure matrix. (Circles with crosses/dots)", image: true },
        { text: "Which figure continues the series? (Line structures)", image: true },
        { text: "Which figure completes the series? (Polygons)", image: true },
        { text: "Which figure completes the series? (Symbols containing lines and boxes)", image: true },
        { text: "If the transparent piece of paper is folded along the middle, which of the illustrations will result?", image: true },
        { text: "Find the pattern that can be folded into the object below.", image: true },
        { text: "Which one of the groups of bricks combine to make the cube above?", image: true }
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
export const TOTAL_QUESTIONS = questions.length;
export const TOTAL_PERSONALITY = personalityQuestions.length;
export const TOTAL_INTEREST = interestQuestions.length;
export const TOTAL_APTITUDE = aptitudeQuestions.length;
