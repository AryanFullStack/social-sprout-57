import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, tone, platform } = await req.json();
    
    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Google Gemini API key not configured');
    }

    // Create a platform-specific prompt
    const platformGuidelines = {
      facebook: "engaging and conversational tone with emojis, suitable for Facebook's diverse audience",
      instagram: "visual-first content with relevant hashtags and inspirational tone for Instagram",
      linkedin: "professional and industry-focused content appropriate for LinkedIn's business network"
    };

    const toneDescriptions = {
      professional: "formal, business-oriented, and authoritative",
      casual: "friendly, conversational, and approachable", 
      promotional: "persuasive, sales-focused, and action-oriented"
    };

    const prompt = `Create a social media post about "${topic}" with a ${toneDescriptions[tone]} tone for ${platform}. 

Guidelines:
- ${platformGuidelines[platform]}
- Keep it engaging and appropriate for the platform
- Include relevant hashtags (3-5)
- Suggest a call-to-action
- Maximum 280 characters for the main content
- Be creative and authentic

Format your response as:
Content: [main post content]
Hashtags: [suggested hashtags]
CTA: [call to action]`;

    console.log('Sending request to Gemini API with prompt:', prompt);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse the response to extract content, hashtags, and CTA
    const contentMatch = generatedText.match(/Content:\s*(.+?)(?=\n(?:Hashtags|CTA|$))/s);
    const hashtagsMatch = generatedText.match(/Hashtags:\s*(.+?)(?=\n(?:CTA|$))/s);
    const ctaMatch = generatedText.match(/CTA:\s*(.+?)(?=\n|$)/s);

    const result = {
      content: contentMatch ? contentMatch[1].trim() : generatedText.substring(0, 280),
      hashtags: hashtagsMatch ? hashtagsMatch[1].trim() : '',
      cta: ctaMatch ? ctaMatch[1].trim() : '',
      fullResponse: generatedText
    };

    console.log('Parsed result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate content with Google Gemini'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});