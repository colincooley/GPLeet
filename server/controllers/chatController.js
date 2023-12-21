const OpenAI = require('openai');

const openai = new OpenAI();

exports.sendMessage = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { userMessage, previousMessages } = req.body;

  try {
    const messages = [...previousMessages, { role: 'user', content: userMessage }];
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 256,
      temperature: 0.7,
      top_p: 1,
    });
    res.status(200).json({ aiMessage: response.choices[0].message });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).send(`Error communicating with the AI: ${error.message}`);
  }
};
