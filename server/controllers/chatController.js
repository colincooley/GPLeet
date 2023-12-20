const axios = require('axios');
const openAIEndpoint = 'https://api.openai.com/v1/chat/completions';

exports.sendMessage = async (req, res) => {
  try {
    const userMessage = req.body.message;
    const response = await axios.post(
      openAIEndpoint,
      { messages: [{ role: 'user', content: userMessage }] },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    res.json({ aiMessage: aiResponse });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error.response?.data || error);
    res.status(500).send(`Error from OpenAI: ${error.response?.data?.error?.message || 'Error communicating with the AI.'}`);

  }
};
