const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_STUDIO_API_KEY);

const chatbot = async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Validate input
        if (!message || message.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        // 2. Check API key
        if (!process.env.GEMINI_AI_STUDIO_API_KEY) {
            return res.status(500).json({
                success: false,
                message: "Gemini API key missing"
            });
        }

        // 3. Initialize model (USE STABLE MODEL)
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        // 4. Prompt
        const prompt = `
                You are Civora AI Assistant.
                
                Civora is a citizen grievance platform. 
                
                Your job:
                - Help users use Civora
                - Answer politely
                - Give navigation guidance when needed
                
                IMPORTANT:
                
                If user asks about:
                - tracking complaints
                - notifications
                - issue status
                
                Return JSON:
                if (!localStorage.getItem("token")) {
                    return {
                        reply: "Please login first to view your notifications.",
                        redirect: "/login",
                        buttonText: "Login Now"
                    };
                }

                return {
                    reply: "You can track complaint updates from the Notifications page.",
                    redirect: "/notifications",
                    buttonText: "Open Notifications"
                };
                
                If user asks about:
                - reporting issue
                - raising complaint
                - create issue
                
                Return:
                {
                  "reply": "You can report a new issue from the Public Issues page. But Guests can browse issues only and login or registration is required to report complaints, upvote issues, and receive notifications.",
                  "redirect": "/issues",
                  "buttonText": "Open Public Issues"
                }
                
                If user asks about:
                - login
                - signup
                - register
                - report issue as guest

                Return:
                {
                  "reply": "You can login using the Login page.",
                   "action": "openLoginModal",
                  "buttonText": "Login / Register"
                }

                If user asks about:
                - login
                - signup
                - register
                - report issue as guest

                Return:
                {
                    "reply": "For assistance or to contact an administrator, please look for a 'Contact' section, available in the header of the Civora website.
                    This section usually provides methods to get in touch with our support team."
                    "redirect": "/contact",
                    "buttonText": "Contact"

                }
                
                For normal questions:
                {
                  "reply": "normal answer",
                  "redirect": null,
                  "buttonText": null
                }
                
                ONLY RETURN JSON.
                NO EXTRA TEXT.
                
                User Message:
                ${message}
        `;

        // 5. Call Gemini safely
        const result = await model.generateContent(prompt);

        const response = await result.response;

        const text = await response.text();

        const cleanedText = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsedResponse = JSON.parse(cleanedText);

        return res.status(200).json({
            success: true,
            reply: parsedResponse.reply,
            redirect: parsedResponse.redirect || null,
            action: parsedResponse.action || null,
            buttonText: parsedResponse.buttonText || null
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "AI Error"
        });
    }
};

module.exports = {
    chatbot
};