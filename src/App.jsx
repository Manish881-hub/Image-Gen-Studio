import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
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

  // Free Image Generation using Pollinations.ai
  const handleGenerate = () => {
    if (!prompt) return;

    setIsGenerating(true);

    // Determine image dimensions based on aspect ratio
    let width = 1024;
    let height = 1024;
    if (aspectRatio === '16:9') { width = 1600; height = 900; }
    else if (aspectRatio === '9:16') { width = 900; height = 1600; }

    const seed = Math.floor(Math.random() * 100000);
    const encodedPrompt = encodeURIComponent(prompt);

    // Using the NEW Pollinations.ai endpoint (gen.pollinations.ai)
    const aiImage = `https://gen.pollinations.ai/image/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

    const newImage = {
      id: Date.now(),
      url: aiImage,
      prompt: prompt,
      aspectRatio: aspectRatio,
      timestamp: new Date().toISOString(),
    };

    setCurrentImage(newImage);
    setHistory(prev => [newImage, ...prev]);
    setIsGenerating(false);
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
            <>
              {/* Show Sign In page when user is not authenticated */}
              <SignedOut>
                <div className="auth-container">
                  <SignIn
                    appearance={{
                      elements: {
                        rootBox: "auth-box",
                        card: "auth-card",
                      }
                    }}
                  />
                </div>
              </SignedOut>

              {/* Show the app when user is authenticated */}
              <SignedIn>
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
              </SignedIn>
            </>
          )}
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
