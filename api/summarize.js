// =========================================================
// StudyBuddy AI — api/summarize.js
// Day 5: Real AI integration via Google Gemini API (free tier)
// This is the ONLY file that ever touches the API key.
// =========================================================

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { text } = req.body || {};

  // ---- Server-side validation (never trust the client alone) ----
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Text must be between 50 and 6000 characters.' });
  }

  const trimmedLength = text.trim().length;
  if (trimmedLength < 50 || text.length > 6000) {
    return res.status(400).json({ error: 'Text must be between 50 and 6000 characters.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in environment variables.');
    return res.status(500).json({ error: 'Server is not configured correctly. Please try again later.' });
  }

  // ---- Build the structured prompt ----
  const prompt = `You are helping a student study. Based on the following text, generate a JSON object with exactly this shape:

{
  "summary": "a concise 3-5 sentence summary of the text",
  "keyPoints": ["4 to 6 short bullet-point key takeaways as strings"],
  "quiz": [
    {
      "question": "a quiz question testing understanding of the text",
      "options": ["4 possible answers as strings"],
      "correctIndex": 0
    }
  ]
}

Generate exactly 3 to 5 quiz questions, each with exactly 4 options. "correctIndex" must be a number from 0 to 3 pointing to the correct option.

Respond with ONLY valid JSON. No markdown formatting, no code fences, no backticks, no extra commentary before or after the JSON.

Text to analyze:
"""
${text}
"""`;

  // ---- Call the Gemini API with a 20-second timeout ----
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  let geminiResponse;
  try {
    geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json',
          },
        }),
        signal: controller.signal,
      }
    );
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'This is taking longer than expected. Please try again.' });
    }
    console.error('Gemini API network error:', err);
    return res.status(502).json({ error: 'AI service is temporarily unavailable. Please try again.' });
  }
  clearTimeout(timeoutId);

  if (!geminiResponse.ok) {
    console.error('Gemini API returned an error status:', geminiResponse.status);
    return res.status(502).json({ error: 'AI service is temporarily unavailable. Please try again.' });
  }

  // ---- Parse Gemini's response ----
  let geminiData;
  try {
    geminiData = await geminiResponse.json();
  } catch (err) {
    console.error('Failed to parse Gemini response as JSON:', err);
    return res.status(500).json({ error: 'Something went wrong generating your summary. Please try again.' });
  }

  const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    console.error('Gemini response missing expected text content:', JSON.stringify(geminiData));
    return res.status(500).json({ error: 'Something went wrong generating your summary. Please try again.' });
  }

  // ---- Parse the model's JSON output (the actual summary/keyPoints/quiz) ----
  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    console.error('Failed to parse model output as JSON:', rawText);
    return res.status(500).json({ error: 'Something went wrong generating your summary. Please try again.' });
  }

  // ---- Validate the shape before trusting it ----
  if (
    typeof parsed.summary !== 'string' ||
    !Array.isArray(parsed.keyPoints) ||
    !Array.isArray(parsed.quiz)
  ) {
    console.error('Model output has unexpected shape:', parsed);
    return res.status(500).json({ error: 'Something went wrong generating your summary. Please try again.' });
  }

  return res.status(200).json(parsed);
}