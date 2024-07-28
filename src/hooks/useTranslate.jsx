import { useEffect, useState } from 'react'
// import Anthropic from '@anthropic-ai/sdk'
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});


// const domain = window.location.origin || '';
// const anthropic = new Anthropic({
//     apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_KEY,
//     baseURL: domain + '/anthropic/',
// });

const useTranslate = (sourceText, selectedLanguage) => {
    const [targetText, setTargetText] = useState();

    useEffect(() => {
        const handleTranslate = async (sourceText) => {
            try {
                // const response = await anthropic.messages.create({
                //     model: "claude-3-5-sonnet-20240620",
                //     max_tokens: 1000,
                //     temperature: 0,
                //     system: "Respond only with translated text.",
                //     messages:[{role:'user', content: 
                //         `
                //         You will be provided with a sentence. This sentence: ${sourceText}.
                //         Your task are to:
                //         - detect what language the sentence is in
                //         - translate the sentence into ${selectedLanguage}
                //         do not return anything other than the translated sentence
                //         `
                //     }]
                // })
                const response = await openai.chat.completions.create({
                    model:'gpt-3.5-turbo',
                    messages:[{role:'user', content: 
                        `
                        You will be provided with a sentence. This sentence: ${sourceText}.
                        Your task are to:
                        - detect what language the sentence is in
                        - translate the sentence into ${selectedLanguage}
                        do not return anything other than the translated sentence
                        `
                    }]
                })
                const data = 'response.choices[0].message.content'
                setTargetText(data)
            } catch (error) {
                console.log('Error translating text: ', error);
            }
        }

        if(sourceText.trim()) {
            const timeoutId = setTimeout(() => {
               handleTranslate(sourceText) 
            }, 500);

            return () => clearTimeout(timeoutId)
        }
    }, [sourceText, selectedLanguage])
    return targetText
};

export default useTranslate;