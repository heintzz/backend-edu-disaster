const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const MODEL_NAME = 'gemini-1.5-flash';
const API_KEY = process.env.CHATBOT_API_KEY;

async function generateResponse(request) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 1,
    topK: 64,
    topP: 0.95,
    maxOutputTokens: 300,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const parts = [{ text: `input: ${request}` }, { text: 'output: ' }];

  const result = await model.generateContent({
    contents: [{ role: 'user', parts }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  return response;
}

const requestResponse = async (req, res) => {
  const { message } = req.body;
  const response = await generateResponse(message);
  res.status(200).send({
    success: true,
    message: 'response generated successfully',
    data: response,
  });
};

const ChatbotController = {
  requestResponse,
};

module.exports = ChatbotController;
