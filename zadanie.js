import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getArticleContentFromFile = (filePath) => {
    return fs.readFileSync(filePath, 'utf8');
}

const saveToFile = (filePath, generatedText) => {
    fs.writeFileSync(filePath, generatedText, 'utf8');
}

const preparePrompt = (articleContent) => {
    return `
        Przekonwertuj poniższy artykuł na kod HTML. 
        - Użyj odpowiednich tagów HTML, takich jak <h1>, <h2>, <p>, itp., aby strukturyzować treść.
        - W miejscach, które sugerują użycie grafiki, wstaw tag <img> z src="image_placeholder.jpg" i atrybutem alt opisującym obraz. 
        - Dodaj podpisy pod grafikami przy użyciu tagu <figcaption>.
        - Zwróć **tylko** zawartość, którą należy wstawić między tagi <body> i </body> (bez <html>, <head> ani <body>).
        - Nie dodawaj żadnego kodu CSS ani JavaScript.
        Treść artykułu:
        
        ${articleContent}
        `;
}

const generateText = async () => {
    try {
        const articleContent = getArticleContentFromFile("tresc_artykulu.txt");

        const prompt = preparePrompt(articleContent);

        const apiResponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: "user", content: prompt }],
        });
        const generatedText = apiResponse.choices[0].message.content;

        saveToFile('artykul.html', generatedText)
    } catch (error) {
        // Handle error
        console.error('Error:', error);
    }
}

generateText()