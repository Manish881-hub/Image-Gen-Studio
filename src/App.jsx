import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Studio } from './components/Studio';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { Chat } from './components/Chat';
import './App.css';
import { ThemeProvider } from "./components/theme-provider"
import { SplashScreen } from './components/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9'); // Default aspect ratio
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [history, setHistory] = useState([]);

  // OpenRouter Generation Function
  const handleGenerate = async () => {
    if (!prompt) return;

    // Check environment variable first, then local storage
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || localStorage.getItem('openrouter_key');

    if (!apiKey) {
      alert("Please enter your OpenRouter API Key in the Chat settings first!");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "ImageGen Studio",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "openai/dall-e-3",
          "messages": [
            {
              "role": "user",
              "content": `Generate an image of: ${prompt}. Aspect ratio: ${aspectRatio}`
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Generation failed");
      }

      const data = await response.json();

      // OpenRouter/DALL-E 3 usually returns the image URL in the content or a specific tool call
      // For DALL-E 3 specifically via standard OpenAI API it's in data.data[0].url but via Chat Completion
      // it might be in content as markdown or a direct URL. 
      // Let's assume standard content link for now or handle the specific format.
      // NOTE: OpenRouter's behavior for image models mapped to chat completions:
      // Often returns the URL in content.

      let imageUrl = data.choices[0]?.message?.content;

      // Simple check if content is a URL, if it's wrapped in markdown ![image](url), extract it
      const markdownRegex = /!\[.*?\]\((.*?)\)/;
      const match = imageUrl.match(markdownRegex);
      if (match) {
        imageUrl = match[1];
      }

      const newImage = {
        id: Date.now(),
        url: imageUrl,
        prompt: prompt,
        aspectRatio: aspectRatio,
        timestamp: new Date().toISOString(),
      };

      setCurrentImage(newImage);
      setHistory(prev => [newImage, ...prev]);

    } catch (error) {
      console.error("Generation Failed:", error);
      alert(`Generation Failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectHistory = (image) => {
    setCurrentImage(image);
    setPrompt(image.prompt);
    setAspectRatio(image.aspectRatio);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <div className="app-container">
          {showSplash ? (
            <SplashScreen onComplete={() => setShowSplash(false)} />
          ) : (
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={
                  <Studio
                    prompt={prompt}
                    setPrompt={setPrompt}
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                    onGenerate={handleGenerate}
                    currentImage={currentImage}
                    isGenerating={isGenerating}
                    history={history}
                    onSelectHistory={handleSelectHistory}
                  />
                } />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="chat" element={<Chat currentImage={currentImage} />} />
              </Route>
            </Routes>
          )}
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
