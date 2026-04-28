export type Question = {
  id: string;
  type: "personality" | "interest" | "aptitude";
  question: string;
  options?: Extract<any, any> | any;
  image_url?: string;
  correct_answer?: string;
};

// Update to ensure type strictness matches prompt expectation while allowing both string[] and structured options.
export type ValidatedQuestion = Omit<Question, "options"> & {
  options?: (string | { id: string; image_url?: string })[];
};

const BASE = "https://peadrroqdtvysvdhgdrf.supabase.co/storage/v1/object/public/question-assets/aptitude";

export const QUESTION_BANK: ValidatedQuestion[] = [
  // PERSONALITY
  { id: "p1", type: "personality", question: "I am the life of the party." },
  { id: "p2", type: "personality", question: "I feel little concern for others." },
  { id: "p3", type: "personality", question: "I am always prepared." },
  { id: "p4", type: "personality", question: "I get stressed out easily." },
  { id: "p5", type: "personality", question: "I have a rich vocabulary." },
  { id: "p6", type: "personality", question: "I don't talk a lot." },
  { id: "p7", type: "personality", question: "I am interested in people." },
  { id: "p8", type: "personality", question: "I leave my belongings around." },
  { id: "p9", type: "personality", question: "I am relaxed most of the time." },
  { id: "p10", type: "personality", question: "I have difficulty understanding abstract ideas." },
  { id: "p11", type: "personality", question: "I feel comfortable around people." },
  { id: "p12", type: "personality", question: "I insult people." },
  { id: "p13", type: "personality", question: "I pay attention to details." },
  { id: "p14", type: "personality", question: "I worry about things." },
  { id: "p15", type: "personality", question: "I have a vivid imagination." },
  { id: "p16", type: "personality", question: "I keep in the background." },
  { id: "p17", type: "personality", question: "I sympathize with others' feelings." },
  { id: "p18", type: "personality", question: "I make a mess of things." },
  { id: "p19", type: "personality", question: "I seldom feel blue." },
  { id: "p20", type: "personality", question: "I am not interested in abstract ideas." },
  { id: "p21", type: "personality", question: "I start conversations." },
  { id: "p22", type: "personality", question: "I am not interested in other people's problems." },
  { id: "p23", type: "personality", question: "I get chores done right away." },
  { id: "p24", type: "personality", question: "I am easily disturbed." },
  { id: "p25", type: "personality", question: "I have excellent ideas." },
  { id: "p26", type: "personality", question: "I have little to say." },
  { id: "p27", type: "personality", question: "I have a soft heart." },
  { id: "p28", type: "personality", question: "I often forget to put things back in their proper place." },
  { id: "p29", type: "personality", question: "I get upset easily." },
  { id: "p30", type: "personality", question: "I do not have a good imagination." },
  { id: "p31", type: "personality", question: "I talk to a lot of different people at parties." },
  { id: "p32", type: "personality", question: "I am not really interested in others." },
  { id: "p33", type: "personality", question: "I like order." },
  { id: "p34", type: "personality", question: "I change my mood a lot." },
  { id: "p35", type: "personality", question: "I am quick to understand things." },
  { id: "p36", type: "personality", question: "I don't like to draw attention to myself." },
  { id: "p37", type: "personality", question: "I take time out for others." },
  { id: "p38", type: "personality", question: "I shirk my duties." },
  { id: "p39", type: "personality", question: "I have frequent mood swings." },
  { id: "p40", type: "personality", question: "I use difficult words." },
  { id: "p41", type: "personality", question: "I don't mind being the center of attention." },
  { id: "p42", type: "personality", question: "I feel others' emotions." },
  { id: "p43", type: "personality", question: "I follow a schedule." },
  { id: "p44", type: "personality", question: "I get irritated easily." },
  { id: "p45", type: "personality", question: "I spend time reflecting on things." },
  { id: "p46", type: "personality", question: "I am quiet around strangers." },
  { id: "p47", type: "personality", question: "I make people feel at ease." },
  { id: "p48", type: "personality", question: "I am exacting in my work." },
  { id: "p49", type: "personality", question: "I often feel blue." },
  { id: "p50", type: "personality", question: "I am full of ideas." },

  // INTEREST
  { id: "i1", type: "interest", question: "Test the quality of parts before shipment." },
  { id: "i2", type: "interest", question: "Lay brick or tile." },
  { id: "i3", type: "interest", question: "Repair household appliances." },
  { id: "i4", type: "interest", question: "Raise fish in a hatchery." },
  { id: "i5", type: "interest", question: "Build kitchen cabinets." },
  { id: "i6", type: "interest", question: "Guard money in an armored car." },
  { id: "i7", type: "interest", question: "Operate a machine on a production line." },
  { id: "i8", type: "interest", question: "Repair and install locks." },
  { id: "i9", type: "interest", question: "Study the structure of the human body." },
  { id: "i10", type: "interest", question: "Study bacteria in a laboratory." },
  { id: "i11", type: "interest", question: "Conduct chemical experiments." },
  { id: "i12", type: "interest", question: "Examine blood samples using a microscope." },
  { id: "i13", type: "interest", question: "Study the movement of planets." },
  { id: "i14", type: "interest", question: "Examine fossils that are thousands of years old." },
  { id: "i15", type: "interest", question: "Develop a new medicine." },
  { id: "i16", type: "interest", question: "Study the causes of diseases." },
  { id: "i17", type: "interest", question: "Write a script for a movie." },
  { id: "i18", type: "interest", question: "Write a song." },
  { id: "i19", type: "interest", question: "Play a musical instrument." },
  { id: "i20", type: "interest", question: "Act in a play." },
  { id: "i21", type: "interest", question: "Design a poster for an event." },
  { id: "i22", type: "interest", question: "Paint a picture." },
  { id: "i23", type: "interest", question: "Write a novel." },
  { id: "i24", type: "interest", question: "Conduct an orchestra." },
  { id: "i25", type: "interest", question: "Teach an individual an exercise routine." },
  { id: "i26", type: "interest", question: "Help people with personal or emotional problems." },
  { id: "i27", type: "interest", question: "Give career advice to people." },
  { id: "i28", type: "interest", question: "Perform rehabilitation therapy." },
  { id: "i29", type: "interest", question: "Help people with addiction problems." },
  { id: "i30", type: "interest", question: "Teach children how to read." },
  { id: "i31", type: "interest", question: "Help crime victims." },
  { id: "i32", type: "interest", question: "Volunteer at a social service agency." },
  { id: "i33", type: "interest", question: "Sell luxury items or jewelry." },
  { id: "i34", type: "interest", question: "Manage a retail store." },
  { id: "i35", type: "interest", question: "Operate a beauty salon." },
  { id: "i36", type: "interest", question: "Manage a department." },
  { id: "i37", type: "interest", question: "Start your own business." },
  { id: "i38", type: "interest", question: "Negotiate contracts." },
  { id: "i39", type: "interest", question: "Manage hotel operations." },
  { id: "i40", type: "interest", question: "Represent a client in a lawsuit." },
  { id: "i41", type: "interest", question: "Keep inventory records." },
  { id: "i42", type: "interest", question: "Generate customer invoices." },
  { id: "i43", type: "interest", question: "Develop record systems." },
  { id: "i44", type: "interest", question: "Enter data into database." },
  { id: "i45", type: "interest", question: "Compute financial data." },
  { id: "i46", type: "interest", question: "Maintain payroll records." },
  { id: "i47", type: "interest", question: "Track expenses." },
  { id: "i48", type: "interest", question: "Record transactions in a ledger." },

  // APTITUDE
  {
    id: "a1",
    type: "aptitude",
    question: "What comes next in the sequence? 32, ?, 48, 56",
    options: ["36", "40", "44", "52"],
    correct_answer: "40"
  },
  {
    id: "a2",
    type: "aptitude",
    question: "Identify the pattern",
    image_url: `${BASE}/questions/q2.png`,
    options: ["1", "2", "7", "4"],
    correct_answer: "4"
  },
  {
    id: "a3",
    type: "aptitude",
    question: "Find the missing number: 2, 4, 8, 16, ?",
    options: ["18", "24", "32", "30"],
    correct_answer: "32"
  },
  {
    id: "a4",
    type: "aptitude",
    question: "Find the missing number: 3, 6, 9, ?, 15",
    options: ["10", "11", "12", "13"],
    correct_answer: "12"
  },
  {
    id: "a5",
    type: "aptitude",
    question: "Solve: (-5) × 9 = ?",
    options: ["-45", "45", "-40", "40"],
    correct_answer: "-45"
  },
  {
    id: "a6",
    type: "aptitude",
    question: "Find the missing number: 2, 5, 8, 11, ?",
    options: ["13", "14", "15", "16"],
    correct_answer: "14"
  },
  {
    id: "a7",
    type: "aptitude",
    question: "Which word is related to 'Book'?",
    options: ["Paper", "Knowledge", "Library", "Page"],
    correct_answer: "Knowledge"
  },
  {
    id: "a8",
    type: "aptitude",
    question: "Which word is opposite of 'Destroy'?",
    options: ["Build", "Break", "Damage", "Remove"],
    correct_answer: "Build"
  },
  {
    id: "a9",
    type: "aptitude",
    question: "Which word is a palindrome?",
    options: ["Level", "Madam", "Radar", "All"],
    correct_answer: "All"
  },
  {
    id: "a10",
    type: "aptitude",
    question: "All cats are animals. Some animals are wild. Are all cats wild?",
    options: ["True", "False", "Cannot be determined", "None"],
    correct_answer: "False"
  },
  {
    id: "a11",
    type: "aptitude",
    question: "Five cars are parked. Car A is to the left of Car B. Car C is to the right of Car B. Car D is to the left of Car A. Which car is at the extreme left?",
    options: ["Car A", "Car B", "Car C", "Car D"],
    correct_answer: "Car D"
  },
  {
    id: "a12",
    type: "aptitude",
    question: "Select the correct figure",
    image_url: `${BASE}/questions/q12.png`,
    options: [
      { id: "A", image_url: `${BASE}/options/q12_A.png` },
      { id: "B", image_url: `${BASE}/options/q12_B.png` },
      { id: "C", image_url: `${BASE}/options/q12_C.png` },
      { id: "D", image_url: `${BASE}/options/q12_D.png` }
    ],
    correct_answer: "C"
  },
  {
    id: "a13",
    type: "aptitude",
    question: "Select the correct figure",
    image_url: `${BASE}/questions/q13.svg`,
    options: [
      { id: "A", image_url: `${BASE}/options/q13_A.svg` },
      { id: "B", image_url: `${BASE}/options/q13_B.svg` },
      { id: "C", image_url: `${BASE}/options/q13_C.svg` },
      { id: "D", image_url: `${BASE}/options/q13_D.svg` }
    ],
    correct_answer: "D"
  },
  {
    id: "a14",
    type: "aptitude",
    question: "Select the correct figure",
    image_url: `${BASE}/questions/q14.png`,
    options: [
      { id: "A", image_url: `${BASE}/options/q14_A.png` },
      { id: "B", image_url: `${BASE}/options/q14_B.png` },
      { id: "C", image_url: `${BASE}/options/q14_C.png` },
      { id: "D", image_url: `${BASE}/options/q14_D.png` }
    ],
    correct_answer: "B"
  },
  {
    id: "a15",
    type: "aptitude",
    question: "Select the correct figure",
    image_url: `${BASE}/questions/q15.png`,
    options: [
      { id: "A", image_url: `${BASE}/options/q15_A.png` },
      { id: "B", image_url: `${BASE}/options/q15_B.png` },
      { id: "C", image_url: `${BASE}/options/q15_C.png` },
      { id: "D", image_url: `${BASE}/options/q15_D.png` }
    ],
    correct_answer: "D"
  },
  {
    id: "a16",
    type: "aptitude",
    question: "Select the correct figure",
    image_url: `${BASE}/questions/q16.png`,
    options: [
      { id: "A", image_url: `${BASE}/options/q16_A.png` },
      { id: "B", image_url: `${BASE}/options/q16_B.png` },
      { id: "C", image_url: `${BASE}/options/q16_C.png` },
      { id: "D", image_url: `${BASE}/options/q16_D.png` }
    ],
    correct_answer: "A"
  },
  {
    id: "a17",
    type: "aptitude",
    question: "Select the correct figure",
    image_url: `${BASE}/questions/q17.png`,
    options: [
      { id: "A", image_url: `${BASE}/options/q17_A.png` },
      { id: "B", image_url: `${BASE}/options/q17_B.png` },
      { id: "C", image_url: `${BASE}/options/q17_C.png` },
      { id: "D", image_url: `${BASE}/options/q17_D.png` }
    ],
    correct_answer: "A"
  },
  {
    id: "a18",
    type: "aptitude",
    question: "Select the correct figure",
    image_url: `${BASE}/questions/q18.png`,
    options: [
      { id: "A", image_url: `${BASE}/options/q18_A.png` },
      { id: "B", image_url: `${BASE}/options/q18_B.png` },
      { id: "C", image_url: `${BASE}/options/q18_C.png` },
      { id: "D", image_url: `${BASE}/options/q18_D.png` }
    ],
    correct_answer: "D"
  },
  {
    id: "a19",
    type: "aptitude",
    question: "Select the correct figure",
    image_url: `${BASE}/questions/q19.png`,
    options: [
      { id: "A", image_url: `${BASE}/options/q19_A.png` },
      { id: "B", image_url: `${BASE}/options/q19_B.png` },
      { id: "C", image_url: `${BASE}/options/q19_C.png` },
      { id: "D", image_url: `${BASE}/options/q19_D.png` }
    ],
    correct_answer: "A"
  },
  {
    id: "a20",
    type: "aptitude",
    question: "Select the correct figure",
    image_url: `${BASE}/questions/q20.png`,
    options: [
      { id: "A", image_url: `${BASE}/options/q20_A.png` },
      { id: "B", image_url: `${BASE}/options/q20_B.png` },
      { id: "C", image_url: `${BASE}/options/q20_C.png` },
      { id: "D", image_url: `${BASE}/options/q20_D.png` }
    ],
    correct_answer: "A"
  }
];

// ── Validation and Integrity Fixes ──────────────────────────────────────────

const validateQuestionBank = () => {
    const aptitudeIds = Array.from({ length: 20 }, (_, i) => `a${i + 1}`);
    const missingQuestions: string[] = [];
    const missingAnswers: string[] = [];
    const invalidAnswers: string[] = [];
    let fixedCount = 0;

    aptitudeIds.forEach(id => {
        const question = QUESTION_BANK.find(q => q.id === id);
        
        if (!question) {
            missingQuestions.push(id);
            QUESTION_BANK.push({
                id,
                type: "aptitude",
                question: "Placeholder question (auto-generated)",
                correct_answer: "placeholder"
            });
            fixedCount++;
        } else {
            if (question.correct_answer === undefined || question.correct_answer === null || String(question.correct_answer).trim() === "") {
                missingAnswers.push(id);
                question.correct_answer = "placeholder";
                fixedCount++;
            } else if (typeof question.correct_answer !== "string") {
                // Normalization: Ensure all answers are stored as strings
                question.correct_answer = String(question.correct_answer);
            }
        }
    });

    if (missingQuestions.length > 0) console.warn("MISSING QUESTIONS:", missingQuestions);
    if (missingAnswers.length > 0) console.warn("MISSING ANSWERS:", missingAnswers);
    if (invalidAnswers.length > 0) console.warn("INVALID ANSWERS:", invalidAnswers);

    const validAnswers = QUESTION_BANK.filter(q => q.type === "aptitude" && q.correct_answer && q.correct_answer !== "placeholder").length;

    console.log("QUESTION_BANK VALIDATION COMPLETE", {
        total_questions: QUESTION_BANK.filter(q => q.type === "aptitude").length,
        valid_answers: validAnswers,
        missing_fixed: fixedCount
    });
};

validateQuestionBank();
