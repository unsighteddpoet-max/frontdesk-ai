export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: 'No message provided' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are FrontDesk AI, a helpful restaurant assistant. Answer politely and help customers with bookings, menus, opening hours, delivery, and general questions.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({ reply: 'AI request failed' });
    }

    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not respond right now.';
    return res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ reply: 'Something went wrong on the server.' });
  }
}
