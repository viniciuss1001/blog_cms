"use server"
import axios from 'axios'

type sendPromptToGeminiProps = {
	prompt: string
}

export const sendPromptToGemini = async ({ prompt }: sendPromptToGeminiProps) => {
	const req = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_APY_KEY!}`, {
		contents: [
			{ "parts": [{ "text": prompt }] }
		]
	})

	try {
		let response = req.data.candidates[0].content.parts[0].text

		response = response.replace("```json","").replace("```", "")

		return JSON.parse(response)

	} catch (error) {
		console.log('response gemini error', error)
	}
}