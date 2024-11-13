import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

function readArticleFile(filePath) {
    return fs.readFileSync(filePath, 'utf8');
  }

async function generateText() {
    try {
        const articleContent = readArticleFile(articleFilePath);

        const prompt = `
        Przekonwertuj poniższy artykuł na kod HTML. 
        - Użyj odpowiednich tagów HTML, takich jak <h1>, <h2>, <p>, itp., aby strukturyzować treść.
        - W miejscach, które sugerują użycie grafiki, wstaw tag <img> z src="image_placeholder.jpg" i atrybutem alt opisującym obraz. 
        - Dodaj podpisy pod grafikami przy użyciu tagu <figcaption>.
        - Zwróć **tylko** zawartość, którą należy wstawić między tagi <body> i </body> (bez <html>, <head> ani <body>).
        - Nie dodawaj żadnego kodu CSS ani JavaScript.
        Treść artykułu:
        
        ${articleContent}
        `;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: "user", content: prompt }],
        });
        const generatedText = response.choices[0].message.content;
        fs.writeFileSync('artykul.html', generatedText, 'utf8');
    } catch (error) {
        console.error('Error:', error);
    }
}

  const articleFilePath = "tresc_artykulu.txt";
  generateText(articleFilePath)