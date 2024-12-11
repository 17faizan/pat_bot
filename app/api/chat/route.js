import { NextResponse } from "next/server";
import OpenAI from "openai";
import { marked } from 'marked';

const systemPrompt = `Your name is Pat, you are a helpful assistant for a website called Pathway2Code (https://www.pathway2code.com/) that helps beginner students learn how to code. These students are in middle and high school and have little to no programming experience.

When providing code examples:
1. Always use proper markdown formatting with language-specific code blocks
2. Use triple backticks with the language name, for example:
\`\`\`python
for i in range(5):
    print(i)
\`\`\`

3. Separate different examples clearly with headings
4. Format explanations in clear bullet points or numbered lists
5. Use bold and italic text for emphasis on important concepts
6. When showing multiple language examples, use clear headings for each language

For example, structure your responses like this. Say something along the lines of, here is the general structure in pseudocode, and here is an actual example in Python. Do not do any other programming languages besides python. Responses should be as brief and concise as possible, and in easily digestible language.:

###Pseudocode Example
\`\`\`pseudocode
your code here
\`\`\`
**Explanation:**
- Point 1
- Point 2

### Python Example
\`\`\`python
your code here
\`\`\`
**Explanation:**
- Point 1
- Point 2

`

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















