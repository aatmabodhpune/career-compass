INSERT INTO career_benchmarks (id, career_name, cluster, benchmark_scores, active)
VALUES

(gen_random_uuid(), 'Software Engineer', 'technical',
'{
  "personality": {"p1": 60, "p2": 70},
  "interest": {"i1": 50},
  "aptitude": {"a1": 0.8, "a2": 0.5, "a3": 0.2, "a4": 0.9, "a5": 0.4, "a6": 0.6, "a7": 0.3, "a8": 0.7, "a9": 0.5},
  "weights": {"personality": 1, "interest": 1, "aptitude": 1},
  "meta": {
    "description": "You are a potential fit for Software Engineer. You possess alignment in key areas. Focus on improving practical skills to fully execute the role.",
    "strengths": ["Analytical thinking", "Problem solving"],
    "improvements": ["Practical exposure", "Execution speed"]
  }
}', true),

(gen_random_uuid(), 'Product Manager', 'management',
'{
  "personality": {"p1": 40, "p2": 55},
  "interest": {"i1": 65},
  "aptitude": {"a2": 0.4, "a4": 0.9, "a6": 0.5, "a8": 0.2, "a10": 0.8, "a12": 0.6, "a14": 0.3, "a16": 0.7, "a18": 0.5, "a20": 0.9},
  "weights": {"personality": 1, "interest": 1, "aptitude": 1},
  "meta": {
    "description": "You are a potential fit for Product Manager. You possess alignment in key areas. Focus on improving practical skills to fully execute the role.",
    "strengths": ["Personality alignment", "Interest alignment"],
    "improvements": ["Aptitude performance", "Communication"]
  }
}', true),

(gen_random_uuid(), 'Data Scientist', 'analytical',
'{
  "personality": {"p1": 80, "p2": 90},
  "interest": {"i1": 20},
  "aptitude": {"a1": 0.3, "a3": 0.7, "a5": 0.4, "a7": 0.8, "a9": 0.6, "a11": 0.2, "a13": 0.9, "a15": 0.5, "a17": 0.4, "a19": 0.7},
  "weights": {"personality": 1, "interest": 1, "aptitude": 1},
  "meta": {
    "description": "You are a potential fit for Data Scientist. You possess alignment in key areas. Focus on improving practical skills to fully execute the role.",
    "strengths": ["Analytical thinking", "Personality alignment"],
    "improvements": ["Practical exposure", "Aptitude performance"]
  }
}', true),

(gen_random_uuid(), 'UX Designer', 'creative',
'{
  "personality": {"p1": 30, "p2": 20},
  "interest": {"i1": 80},
  "aptitude": {"a5": 0.9, "a6": 0.3, "a7": 0.6, "a8": 0.2, "a9": 0.8, "a10": 0.5, "a11": 0.7, "a12": 0.4, "a13": 0.9, "a14": 0.2, "a15": 0.5},
  "weights": {"personality": 1, "interest": 1, "aptitude": 1},
  "meta": {
    "description": "You are a potential fit for UX Designer. You possess alignment in key areas. Focus on improving practical skills to fully execute the role.",
    "strengths": ["Interest alignment", "Problem solving"],
    "improvements": ["Execution speed", "Communication"]
  }
}', true),

(gen_random_uuid(), 'Business Analyst', 'business',
'{
  "personality": {"p1": 50, "p2": 50},
  "interest": {"i1": 50},
  "aptitude": {"a10": 0.2, "a11": 0.9, "a12": 0.5, "a13": 0.4, "a14": 0.7, "a15": 0.3, "a16": 0.8, "a17": 0.6, "a18": 0.2, "a19": 0.9, "a20": 0.5},
  "weights": {"personality": 1, "interest": 1, "aptitude": 1},
  "meta": {
    "description": "You are a potential fit for Business Analyst. You possess alignment in key areas. Focus on improving practical skills to fully execute the role.",
    "strengths": ["Analytical thinking", "Interest alignment"],
    "improvements": ["Execution speed", "Practical exposure"]
  }
}', true),

(gen_random_uuid(), 'Marketing Manager', 'management',
'{
  "personality": {"p1": 90, "p2": 85},
  "interest": {"i1": 90},
  "aptitude": {"a1": 0.6, "a2": 0.4, "a5": 0.8, "a6": 0.2, "a9": 0.9, "a10": 0.5, "a13": 0.3, "a14": 0.7, "a17": 0.4, "a18": 0.8},
  "weights": {"personality": 1, "interest": 1, "aptitude": 1},
  "meta": {
    "description": "You are a potential fit for Marketing Manager. You possess alignment in key areas. Focus on improving practical skills to fully execute the role.",
    "strengths": ["Personality alignment", "Problem solving"],
    "improvements": ["Aptitude performance", "Communication"]
  }
}', true);