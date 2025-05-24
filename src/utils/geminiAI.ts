import { GoogleGenAI } from "@google/genai";

const API_KEY = "AIzaSyBXT8PN6v7G62bjikvKOBZkMqMddiykpes";
const genAI = new GoogleGenAI({ apiKey: API_KEY });

export type AIPromptType =
  | "analyze"
  | "summarize"
  | "improve"
  | "brainstorm"
  | "research";

interface AIResponse {
  text: string;
  error?: string;
}

const promptTemplates = {
  analyze: (content: string) => `
Analyze the following text and provide a detailed yet concise response. Structure your response for clarity, using bullet points or subheadings. Include:

## Key Points
- Summarize the main ideas or arguments.

## Strengths
- Highlight effective or well-written elements.

## Weaknesses or Gaps
- Identify areas that lack clarity, depth, or consistency.

## Suggestions for Improvement
- Provide actionable ideas to improve the content or structure.

Text:
${content}
`,
  summarize: (content: string) => `
Summarize the following text clearly and briefly. Use bullet points or a short paragraph to highlight:

- The main message or purpose
- Key arguments or points
- Final takeaway or conclusion

Keep the summary under 150 words, and make it easy to paste into an editor as a standalone section or intro.

Text:
${content}
`,
  improve: (content: string) => `
Review the following text and suggest improvements. Format your response as:

## Suggested Revisions
- Bullet points or numbered items describing specific changes.
- For each, briefly explain the reason or benefit.

## Optional Rewritten Sections
If helpful, rewrite specific sentences or paragraphs with improved clarity or tone. Label these clearly.

Text:
${content}
`,
  brainstorm: (content: string) => `
Based on the content below, generate related ideas that can be added to or developed from it. Format your output as:

## Related Ideas
- List of new arguments, directions, or angles
- Short and clear, ready to paste into an editor
- Use bullet points or short sub-sections

Text:
${content}
`,
  research: (content: string) => `
Identify useful references or sources related to the content below. Format your output so it's ready to paste into a reference section or footnote-style block.

## Suggested References
- Title: [Name of paper/article/tool]
  - Author(s) or source
  - Brief reason it's relevant

List 3–5 solid suggestions. Include links if possible.

Text:
${content}
`,
};

export async function generateAIContent(
  content: string,
  promptType: AIPromptType
): Promise<AIResponse> {
  try {
    const prompt = promptTemplates[promptType](content);

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response.text;

    return { text };
  } catch (error) {
    console.error("Error generating AI content:", error);
    return {
      text: "",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export function createInsightFromAI(
  text: string,
  type: AIPromptType
): {
  id: string;
  title: string;
  text: string;
  source: string;
  relevance: number;
} {
  const titles = {
    analyze: "Content Analysis",
    summarize: "Document Summary",
    improve: "Writing Improvements",
    brainstorm: "Related Ideas",
    research: "Research Connections",
  };

  return {
    id: `insight-${Date.now()}`,
    title: titles[type],
    text,
    source: "Gemini AI",
    relevance: Math.floor(75 + Math.random() * 25), // Random relevance between 75-100
  };
}
