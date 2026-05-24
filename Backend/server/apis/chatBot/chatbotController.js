const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = process.env.GEMINI_AI_STUDIO_API_KEY;

const chatbot = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.json({
                success: false,
                message: "Message is required"
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        const prompt = `
        You are Civora AI Assistant.

        Civora is a citizen grievance and issue reporting platform.

        Your work:
        - Help users use Civora
        - Explain issue reporting
        - Explain complaint tracking
        - Explain login/signup
        - Explain upvoting
        - Explain categories
        - Explain notifications
        - Explain contacting admins

        Rules:
        - Reply short
        - Reply politely
        - Be user friendly
        - Act like 24/7 support assistant

        User Question:
        ${message}
        `;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        return res.json({
            success: true,
            reply: response
        });

    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: "AI Error"
        });
    }
};

module.exports = {
    chatbot
}
