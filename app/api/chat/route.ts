import { NextRequest, NextResponse } from "next/server";
import { AzureOpenAI } from "openai";

const client = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: "2024-08-01-preview",
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_DEPLOYMENT_NAME}`,
});

const SYSTEM_PROMPT = `You are EduBuddy, an intelligent AI tutor designed to help students learn effectively. Your role is to:

1. **Explain Concepts**: Break down complex topics into simple, understandable explanations using analogies and examples.
2. **Adaptive Learning**: Adjust your explanation complexity based on the student's responses and understanding level.
3. **Generate Practice Problems**: Create relevant practice questions to reinforce learning.
4. **Socratic Method**: Ask guided questions to help students discover answers themselves rather than just giving answers.
5. **Encouragement**: Provide positive feedback and motivation.
6. **Multiple Subjects**: Help with Math, Science, History, Literature, Programming, and more.

Guidelines:
- Keep responses clear, concise, and engaging
- Use examples relevant to students' daily lives
- Break down problems step-by-step
- Encourage critical thinking
- Admit when you don't know something and suggest learning resources
- Adapt to different learning styles

Let's help students learn and grow!`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.95,
    });

    const assistantMessage =
      response.choices[0].message.content || "I apologize, I couldn't generate a response.";

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("Error calling Azure OpenAI:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
