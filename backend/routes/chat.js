// const express = require('express');
// const router = express.Router();
// const OpenAI = require('openai');
// const dotenv = require('dotenv');
// const { verifyToken } = require('../middleware/auth');

// dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// router.post('/', verifyToken, async (req, res) => {
//   try {
//     const prompt = req.body.prompt;

//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         { role: 'system', content: 'You are a healthcare assistant. Answer health-related questions and help users schedule appointments.' },
//         { role: 'user', content: prompt }
//       ]
//     });

//     res.json({ response: response.choices[0].message.content });

//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Chatbot error');
//   }
// });

// module.exports = router;
const express = require('express');
const { AzureOpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

const client = new AzureOpenAI({
  apiKey: process.env.apiKey,
  apiVersion: "2024-05-01-preview",
  baseURL: process.env.endpoint,
});

router.post('/', async (req, res) => {
  try {
    const userInput = req.body.message;

    const result = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant for health.a friendly and helpful virtual health assistant.Only answer questions related to: health based, medicine based, first aid based,basic health advise , common medical quaries , Illness-based diet suggestions, Fitness and wellness, Healthy living tips" },
        { role: "user", content: userInput },
      ],
      model: process.env.DEPLOY_ID,
    });

    const response = result.choices[0].message.content;
    res.json({ response });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

module.exports = router;