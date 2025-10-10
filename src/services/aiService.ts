// The API key is provided in the app and should be handled securely
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "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";

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
      // Try to extract JSON if content contains JSON-like structure
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        return JSON.parse(jsonStr);
      }
      // If no JSON structure found, try parsing the whole content
      return JSON.parse(content);
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      // If parsing fails, create a structured response manually
      return {
        explanation: content.includes('explanation') 
          ? content.split('explanation')[1].split('practicalEffects')[0].replace(/[":{}]/g, '').trim()
          : content,
        practicalEffects: content.includes('practicalEffects') 
          ? content.split('practicalEffects')[1].split('examples')[0].replace(/[":{}]/g, '').trim()
          : "Reflexão sobre como aplicar esta leitura na vida diária.",
        examples: content.includes('examples') 
          ? content.split('examples')[1].replace(/[":\[\]{}]/g, '').split(',').map(ex => ex.trim())
          : ["Dedique um tempo para ler esta passagem novamente.", "Discuta esta passagem com um guia espiritual.", "Ore pedindo discernimento sobre esta leitura."]
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
      Gere uma homilia em português brasileiro para o Evangelho "${gospelReference}" (${liturgicalDay}):
      
      "${gospelText}"
      
      A homilia deve incluir:
      1. Uma introdução que capture a atenção dos fiéis brasileiros
      2. Explicação teológica profunda mas acessível ao público brasileiro
      3. Aplicações práticas para a vida cristã no contexto brasileiro
      4. Exemplos concretos do cotidiano brasileiro
      5. Uma conclusão inspiradora que motive à ação
      
      Importante:
      - Use linguagem pastoral brasileira
      - Faça referências ao contexto social e cultural do Brasil
      - Use expressões e exemplos familiares aos brasileiros
      - Mantenha um tom acolhedor e próximo
      - Evite anglicismos ou expressões estrangeiras
      
      Estruture sua resposta em JSON com os campos:
      title (título da homilia em português), 
      content (o corpo principal da homilia em português) e 
      conclusion (a conclusão inspiradora em português).
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
            role: "system",
            content: "Você é um padre brasileiro com vasta experiência em homilias. Seu objetivo é criar homilias profundas mas acessíveis, sempre em português brasileiro, usando referências culturais e exemplos do cotidiano brasileiro. Suas homilias devem ser inspiradoras e práticas, ajudando os fiéis a aplicarem a Palavra de Deus em suas vidas diárias no contexto brasileiro."
          },
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
      // Try to extract JSON if content contains JSON-like structure
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        return JSON.parse(jsonStr);
      }
      // If no JSON structure found, try parsing the whole content
      return JSON.parse(content);
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      // If parsing fails, create a structured response manually
      return {
        title: `Homilia para ${gospelReference}`,
        content: content.includes('content') 
          ? content.split('content')[1].split('conclusion')[0].replace(/[":{}]/g, '').trim()
          : content.split('conclusion')[0] || content,
        conclusion: content.includes('conclusion') 
          ? content.split('conclusion')[1].replace(/[":{}]/g, '').trim()
          : "Que esta reflexão nos ajude a viver melhor nossa fé no dia a dia. Que Deus nos abençoe."
      };
    }
  } catch (error) {
    console.error('Error generating homilia:', error);
    return {
      title: `Homilia para ${gospelReference}`,
      content: "Não foi possível gerar uma homilia neste momento. Por favor, tente novamente mais tarde.",
      conclusion: "Que Deus nos abençoe e nos guie em nossa jornada de fé."
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
      // Try to extract JSON if content contains JSON-like structure
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        return JSON.parse(jsonStr);
      }
      // If no JSON structure found, try parsing the whole content
      return JSON.parse(content);
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      // If parsing fails, create a structured response manually
      return {
        biography: content.includes('biography') 
          ? content.split('biography')[1].split('teachings')[0].replace(/[":{}]/g, '').trim()
          : content.split('teachings')[0] || content,
        teachings: content.includes('teachings') 
          ? content.split('teachings')[1].split('relevanceToday')[0].replace(/[":{}]/g, '').trim()
          : "Informações sobre os ensinamentos deste santo.",
        relevanceToday: content.includes('relevanceToday') 
          ? content.split('relevanceToday')[1].replace(/[":{}]/g, '').trim()
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
