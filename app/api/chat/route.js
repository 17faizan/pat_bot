import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = "Your name is Pat, you are a helpful assistant for a website called Pathway2Code (https://www.pathway2code.com/) that helps beginner students learn how to code. These students are in middle and high school and have little to no programming experience. This website helps them take lessons from their classes and apply elementary programming skills and concepts to their lessons. They are presented with a task, pseudocode to help them visualize the task and an output that runs the pseudocode and displays a solution or visualization of the task. Your job is to help students with any questions that they ask, whether it be regarding the assignment, explaining coding concepts, or troubleshooting the website. Use simple language and keep in mind these are teenagers learning these concepts for the fist time."

export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...data,
      ],
      model: 'gpt-4o-mini',
      stream: true,
    })

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content
                    if (content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            }
            catch(err) {
                controller.error(err)
            } finally {
                controller.close()
            }
        },
    })

    return new NextResponse(stream)
}















