import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_AI_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_URL,
        "X-Title": "Apollo Wireframe-to-Code" 
    }
});

export const maxDuration = 300;

export async function POST(req: NextRequest) {
    try {
        const { model, description, base64Image } = await req.json();

        // Limit base64 image size if needed
        const maxSizeInBytes = 10 * 1024 * 1024; // 10MB limit
        if (base64Image.length > maxSizeInBytes) {
            throw new Error('Image size too large. Please use an image under 10MB.');
        }

        const response = await openai.chat.completions.create({
            model: model,
            stream: true,
            max_tokens: 4000,
            messages: [
                {
                    "role": "system",
                    "content": "You are a professional UI/UX developer. Analyze the image and provide detailed, accurate HTML/CSS code."
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": description
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": base64Image,
                                detail: "auto"
                            }
                        }
                    ]
                }
            ],
        });

        // Create a readable stream to send data in real-time
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of response) {
                        const text = chunk.choices?.[0]?.delta?.content || "";
                        controller.enqueue(new TextEncoder().encode(text));
                    }
                } catch (error) {
                    console.error('Streaming error:', error);
                    controller.error(error);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });
    } catch (error) {
        console.error('AI processing error:', error);
        return new Response(
            JSON.stringify({ 
                error: 'AI processing failed', 
                details: error instanceof Error ? error.message : 'Unknown error'
            }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
