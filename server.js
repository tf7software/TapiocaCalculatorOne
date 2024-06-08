const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 80;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

app.use(express.json());
app.use(express.static('public'));

app.post('/solve', async (req, res) => {
    const { prompt, type } = req.body;

    try {
        let finalPrompt = '';
        if (type === 'school-safe') {
            finalPrompt = `Provide steps on how to solve the following algebraic expression without giving the final answer: ${prompt}`;
        } else {
            finalPrompt = `Solve the following algebraic expression and show all work: ${prompt}`;
        }

        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        let text = await response.text();

        // Replace **text** with <b>text</b>
        text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

        res.json({ solution: text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve schoolsafe.html for the school-safe version
app.get('/schoolsafe', (req, res) => {
    res.sendFile(__dirname + '/public/schoolsafe.html');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
