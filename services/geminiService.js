// This function now receives the GoogleGenAI and Type objects as arguments.

export async function generateSummary(apiKey, transcript, GoogleGenAI, Type) {
    if (!apiKey) {
        throw new Error("API Key not found. Please set it in the extension options.");
    }
    
    const ai = new GoogleGenAI({ apiKey });

    const schema = {
        type: Type.OBJECT,
        properties: {
            summary: {
                type: Type.STRING,
                description: "A concise, easy-to-read summary of the provided video transcript. Should be a few paragraphs long."
            },
            takeaways: {
                type: Type.ARRAY,
                description: "A bulleted list of the 3-5 most important key takeaways or main points from the video.",
                items: {
                    type: Type.STRING
                }
            },
            actionItems: {
                type: Type.ARRAY,
                description: "A bulleted list of any actionable items, tasks, or recommendations mentioned. If none, return an empty array.",
                items: {
                    type: Type.STRING
                }
            }
        },
        required: ["summary", "takeaways", "actionItems"]
    };

    const prompt = `Please analyze the following YouTube video transcript. Provide a detailed summary, key takeaways, and any action items. Format your response strictly according to the provided JSON schema.\n\nTRANSCRIPT:\n"""\n${transcript}\n"""`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        
        if (response && response.text) {
             const parsedJson = JSON.parse(response.text);
             return parsedJson;
        } else {
             throw new Error("Received an empty or invalid response from the API.");
        }

    } catch (error) {
        console.error("Gemini API Error:", error);
        // Better error message for common issues
        if (error.message.includes('API key not valid')) {
             throw new Error("Invalid API Key. Please check it in the extension options.");
        }
        throw new Error("Failed to get summary from Gemini API.");
    }
}