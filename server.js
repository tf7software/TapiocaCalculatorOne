const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 80;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.use(express.json());
app.use(express.static('public'));

app.post('/solve', async (req, res) => {
    const prompt = req.body.prompt;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = await response.text();

        // Replace **text** with <b>text</b>
        text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

        res.json({ solution: text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
