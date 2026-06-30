// ========================
// Word Bank (500 common English words)
// ========================

const WORDS: string[] = [
  "the", "of", "and", "to", "in", "is", "you", "that", "it", "he",
  "was", "for", "on", "are", "but", "not", "what", "all", "were", "we",
  "when", "your", "can", "had", "have", "has", "each", "which", "their", "said",
  "if", "do", "will", "about", "many", "then", "them", "these", "so", "some",
  "her", "would", "make", "like", "him", "into", "time", "very", "could", "come",
  "made", "after", "did", "back", "see", "only", "its", "over", "such", "other",
  "than", "more", "also", "just", "know", "take", "people", "year", "good", "give",
  "most", "find", "here", "thing", "great", "big", "old", "think", "tell", "day",
  "help", "ask", "men", "look", "run", "way", "well", "end", "does", "get",
  "let", "say", "much", "try", "hand", "high", "keep", "place", "where", "why",
  "set", "went", "once", "work", "play", "put", "life", "must", "name", "part",
  "home", "read", "own", "last", "long", "down", "should", "call", "still", "house",
  "world", "need", "under", "light", "point", "kind", "might", "next", "first", "open",
  "live", "seem", "stand", "form", "change", "group", "every", "line", "city", "land",
  "turn", "show", "side", "away", "right", "hear", "new", "school", "left", "head",
  "air", "move", "state", "close", "sure", "both", "food", "start", "same", "four",
  "girl", "write", "fact", "body", "hold", "pick", "grow", "page", "idea", "felt",
  "hard", "stop", "plan", "fall", "five", "small", "late", "face", "best", "real",
  "walk", "study", "large", "three", "began", "leave", "talk", "between", "along", "care",
  "watch", "water", "often", "room", "book", "mother", "add", "mark", "test", "door",
  "children", "word", "young", "question", "cross", "fire", "fish", "horse", "answer", "tree",
  "sun", "paper", "deep", "road", "table", "example", "hit", "story", "animal", "build",
  "half", "above", "cover", "cold", "south", "clear", "sea", "voice", "farm", "mile",
  "free", "river", "car", "feet", "near", "age", "today", "nothing", "gold", "music",
  "family", "power", "class", "king", "month", "heat", "drive", "fill", "color", "north",
  "front", "field", "ready", "done", "brought", "shall", "money", "morning", "sit", "top",
  "sentence", "lead", "travel", "rain", "hot", "sing", "listen", "sleep", "bed", "ground",
  "measure", "order", "star", "rock", "green", "white", "circle", "island", "draw", "wheel",
  "earth", "wave", "center", "map", "product", "ship", "learn", "plant", "heard", "during",
  "again", "number", "want", "oil", "war", "until", "along", "begin", "those", "being",
  "love", "before", "may", "gone", "round", "piece", "door", "store", "south", "game",
  "case", "party", "step", "dark", "serve", "press", "cost", "check", "class", "early",
  "quiet", "voice", "carry", "hope", "dream", "among", "human", "lunch", "spend", "group",
  "floor", "speed", "sight", "force", "space", "level", "street", "water", "basic", "reach",
  "equal", "break", "share", "heart", "brain", "match", "final", "glass", "watch", "dance",
  "climb", "train", "fruit", "ocean", "chair", "plate", "sugar", "bread", "beach", "cloud",
  "smile", "stone", "stick", "float", "block", "count", "image", "month", "sport", "catch",
  "chart", "paint", "upper", "title", "happy", "trade", "offer", "pound", "steel", "truck",
  "scale", "solve", "model", "shape", "fresh", "craft", "crowd", "guest", "guide", "trend",
  "chief", "skill", "broad", "judge", "labor", "grain", "chief", "rapid", "track", "tower",
  "cable", "minor", "inner", "urban", "prime", "plain", "drama", "prize", "grace", "panel",
  "organ", "waste", "depth", "shift", "trial", "phase", "fault", "blade", "proof", "nerve",
  "fiber", "solar", "range", "steam", "frame", "cycle", "flame", "quote", "spark", "worth",
  "blind", "pride", "arise", "brief", "trend", "storm", "unity", "novel", "globe", "claim",
  "moral", "sharp", "bound", "bonus", "sauce", "angle", "creek", "tiger", "crown", "maple",
  "coral", "honey", "medal", "bloom", "ivory", "crane", "marsh", "ridge", "dwarf", "amber",
  "frost", "blink", "roast", "sweep", "drift", "plume", "grasp", "moose", "churn", "stove",
  "globe", "pluck", "blaze", "siren", "spore", "prism", "chalk", "flint", "haste", "vigor",
  "brace", "clamp", "shrug", "kneel", "hover", "crest", "charm", "perch", "quilt", "torch",
  "wedge", "ridge", "snare", "clasp", "grind", "swirl", "thump", "brisk", "plank", "dwell",
];

// ========================
// Generator Functions
// ========================

/**
 * Picks `wordCount` random words from the word bank and joins them with spaces.
 */
export function generateParagraph(wordCount: number): string {
  const result: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const index = Math.floor(Math.random() * WORDS.length);
    result.push(WORDS[index]);
  }
  return result.join(" ");
}

/**
 * Returns one random word from the word bank.
 */
export function generateWord(): string {
  const index = Math.floor(Math.random() * WORDS.length);
  return WORDS[index];
}
