
// The API key is provided in the app and should be handled securely
const GROQ_API_KEY = "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";

// Types for AI responses
export interface AIExplanationResponse {
  explanation: string;
  practicalEffects: string;
  examples: string[];
}

export interface AIHomiliaResponse {
  title: string;
  content: string;
  conclusion: string;
}

export interface AISaintResponse {
  biography: string;
  teachings: string;
  relevanceToday: string;
}

// Function to generate explanation for a reading
export const generateReadingExplanation = async (
  readingText: string,
  readingReference: string
): Promise<AIExplanationResponse> => {
  try {
    const prompt = `
      Explique a leitura bíblica "${readingReference}" do ponto de vista da fé católica:
      
      "${readingText}"
      
      Forneça uma explicação clara e profunda, destacando os efeitos práticos para uma vida santa 
      e exemplos concretos. Use uma linguagem acessível. Estruture sua resposta em JSON com os campos:
      explanation (explicação teológica clara), practicalEffects (como aplicar no dia-a-dia para santidade), 
      e examples (3 exemplos concretos de aplicação).
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate explanation');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON from the response
    try {
      return JSON.parse(content);
    } catch (e) {
      // If parsing fails, create a structured response manually
      return {
        explanation: content.split('practicalEffects')[0] || content,
        practicalEffects: content.includes('practicalEffects') 
          ? content.split('practicalEffects')[1].split('examples')[0] 
          : "Reflexão sobre como aplicar esta leitura na vida diária.",
        examples: ["Exemplo de aplicação na vida diária.", "Exemplo de como praticar esta virtude.", "Exemplo de como evitar este pecado."]
      };
    }
  } catch (error) {
    console.error('Error generating explanation:', error);
    return {
      explanation: "Não foi possível gerar uma explicação neste momento. Por favor, tente novamente mais tarde.",
      practicalEffects: "Reflita sobre como esta leitura pode se aplicar à sua vida diária.",
      examples: ["Dedique um tempo para ler esta passagem novamente.", "Discuta esta passagem com um guia espiritual.", "Ore pedindo discernimento sobre esta leitura."]
    };
  }
};

// Function to generate a homilia based on the Gospel
export const generateHomilia = async (
  gospelText: string,
  gospelReference: string,
  liturgicalDay: string
): Promise<AIHomiliaResponse> => {
  try {
    const prompt = `
      Gere uma homilia completa e inspiradora para o Evangelho "${gospelReference}" (${liturgicalDay}):
      
      "${gospelText}"
      
      A homilia deve incluir:
      1. Uma introdução que capture a atenção
      2. Explicação teológica profunda mas acessível
      3. Aplicações práticas para a vida cristã
      4. Exemplos concretos 
      5. Uma conclusão poderosa que inspire à ação
      
      Use linguagem clara, inspiradora e acessível. Estruture sua resposta em JSON com os campos:
      title (título da homilia), content (o corpo principal da homilia) e conclusion (a conclusão inspiradora).
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate homilia');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON from the response
    try {
      return JSON.parse(content);
    } catch (e) {
      // If parsing fails, create a structured response manually
      return {
        title: `Homilia para ${gospelReference}`,
        content: content.split('conclusion')[0] || content,
        conclusion: content.includes('conclusion') 
          ? content.split('conclusion')[1] 
          : "Levemos esta reflexão para nossa vida e que Deus nos abençoe."
      };
    }
  } catch (error) {
    console.error('Error generating homilia:', error);
    return {
      title: `Homilia para ${gospelReference}`,
      content: "Não foi possível gerar uma homilia neste momento. Por favor, tente novamente mais tarde.",
      conclusion: "Que Deus nos abençoe e nos guie em nossa jornada espiritual."
    };
  }
};

// Function to generate saint information
export const generateSaintInfo = async (saintName: string): Promise<AISaintResponse> => {
  try {
    const prompt = `
      Forneça informações sobre ${saintName} na tradição católica. Inclua:
      
      1. Uma breve biografia
      2. Seus principais ensinamentos e virtudes
      3. Como seus ensinamentos são relevantes hoje
      
      Use linguagem clara e inspiradora. Estruture sua resposta em JSON com os campos:
      biography (biografia resumida), teachings (principais ensinamentos e virtudes), 
      relevanceToday (relevância para os católicos hoje).
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate saint information');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON from the response
    try {
      return JSON.parse(content);
    } catch (e) {
      // If parsing fails, create a structured response manually
      return {
        biography: content.split('teachings')[0] || content,
        teachings: content.includes('teachings') 
          ? content.split('teachings')[1].split('relevanceToday')[0] 
          : "Informações sobre os ensinamentos deste santo.",
        relevanceToday: content.includes('relevanceToday') 
          ? content.split('relevanceToday')[1] 
          : "Reflexão sobre a relevância deste santo para os dias atuais."
      };
    }
  } catch (error) {
    console.error('Error generating saint information:', error);
    return {
      biography: `Informações sobre ${saintName} não estão disponíveis no momento.`,
      teachings: "Tente novamente mais tarde para obter os ensinamentos deste santo.",
      relevanceToday: "A vida dos santos sempre nos inspira a buscar a santidade em nosso próprio tempo."
    };
  }
};

// Function to convert text to speech using the Web Speech API
export const textToSpeech = (text: string, voiceName?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Text-to-speech not supported in this browser'));
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language to Brazilian Portuguese
    utterance.lang = 'pt-BR';
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // If a specific voice name is provided, try to use it
    if (voiceName && voices.length > 0) {
      const voice = voices.find(v => v.name.includes(voiceName));
      if (voice) {
        utterance.voice = voice;
      }
    }
    
    // Set a medium-slow rate for religious text
    utterance.rate = 0.9;
    
    // Set pitch
    utterance.pitch = 1;
    
    // Set callbacks
    utterance.onend = () => {
      resolve();
    };
    
    utterance.onerror = (event) => {
      reject(new Error(`Speech synthesis error: ${event.error}`));
    };
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  });
};
