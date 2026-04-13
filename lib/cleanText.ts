export const copyCleanText = async (text: string) => {
  const clean = text
    .replace(/#{1,6}\s?/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/__(.*?)__/g, '$1') // Remove underline
    .replace(/`{1,3}([\s\S]*?)`{1,3}/g, '$1') // [\s\S] matches everything including newlines // Remove code backticks
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/>\s?/g, '') // Remove quotes
    .trim();

  try {
    await navigator.clipboard.writeText(clean);
    return true;
  } catch (err) {
    console.error("Copy failed", err);
    return false;
  }
};