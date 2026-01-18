import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Studio } from './components/Studio';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { Chat } from './components/Chat';
import './App.css';
import { ThemeProvider } from "./components/theme-provider"

function App() {

  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9'); // Default aspect ratio
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [history, setHistory] = useState([]);

  // Mock Generation Function
  const handleGenerate = () => {
    if (!prompt) return;

    setIsGenerating(true);

    // Simulate network delay
    setTimeout(() => {
      // Determine image dimensions based on aspect ratio for better placeholders
      let width = 1024;
      let height = 1024;
      if (aspectRatio === '16:9') { width = 1600; height = 900; }
      else if (aspectRatio === '9:16') { width = 900; height = 1600; }

      const seed = Math.floor(Math.random() * 1000);
      const randomImage = `https://picsum.photos/seed/${seed}/${width}/${height}`;

      const newImage = {
        id: Date.now(),
        url: randomImage,
        prompt: prompt,
        aspectRatio: aspectRatio,
        timestamp: new Date().toISOString(),
      };

      setCurrentImage(newImage);
      setHistory(prev => [newImage, ...prev]);
      setIsGenerating(false);
    }, 2000); // 2s simulated generation time
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
              <Route path="chat" element={<Chat />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
