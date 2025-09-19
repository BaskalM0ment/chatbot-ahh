// netlify/functions/chat.js
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { messages, model, temperature, max_tokens } = JSON.parse(event.body || '{}');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens
    })
  });

  if (!response.ok) {
    const txt = await response.text();
    return { statusCode: 500, body: txt };
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || '';

  return {
    statusCode: 200,
    body: JSON.stringify({ reply })
  };
}
