export default async function handler(request, context) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { content, role } = await request.json();

    if (!content) {
      return new Response(JSON.stringify({ error: 'Resume content is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const rolePrompts = {
      general: '',
      'data-scientist': 'Focus on data science skills like Python, R, machine learning, statistics.',
      'web-developer': 'Focus on web development skills like JavaScript, React, Node.js, HTML/CSS.',
      analyst: 'Focus on analytical skills like SQL, Excel, data visualization, business intelligence.'
    };

    const prompt = `Analyze this resume for a ${role} role and return only valid JSON with the fields: ats_score (0-100), summary, suggestions (array of strings), section_scores (skills, experience, keywords), and missing_keywords (array of missing skill keywords). ${rolePrompts[role] || ''} Resume:\n${content}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a resume analyst. Reply only with valid JSON and no extra explanation.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 350,
        temperature: 0.0,
        top_p: 1.0,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: `OpenRouter error: ${errorText}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || '';

    return new Response(JSON.stringify({ rawText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}