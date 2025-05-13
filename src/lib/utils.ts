
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDocumentContent(content: string): string {
  if (!content) return "No content yet";
  
  // Remove HTML tags
  const withoutTags = content.replace(/<\/?[^>]+(>|$)/g, " ").trim();
  
  // Remove extra whitespace
  const withoutExtraSpaces = withoutTags.replace(/\s+/g, " ");
  
  // Check if the content contains AI Generated text
  if (withoutExtraSpaces.includes("AI Generated")) {
    const aiIndex = withoutExtraSpaces.indexOf("AI Generated");
    // Get content after "AI Generated" label
    const afterAI = withoutExtraSpaces.substring(aiIndex + "AI Generated".length).trim();
    // Extract a proper snippet
    return afterAI.length > 0 ? afterAI : "AI generated content";
  }
  
  return withoutExtraSpaces;
}
