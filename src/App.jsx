import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn, useUser } from '@clerk/clerk-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Layout } from './components/Layout';
import { Studio } from './components/Studio';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { Chat } from './components/Chat';
import './App.css';
import { ThemeProvider } from "./components/theme-provider"
import { SplashScreen } from './components/SplashScreen';

function AppContent() {
  const { user } = useUser();
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  // Chat messages state - lifted here to persist across navigation
  const [chatMessages, setChatMessages] = useState([
    { id: 1, role: 'bot', text: 'Hello! Generate an image in the Studio, then ask me anything about it!' }
  ]);

  // Convex queries and mutations
  const saveImage = useMutation(api.images.saveImage);
  const deleteImage = useMutation(api.images.deleteImage);
  const images = useQuery(api.images.getImages,
    user?.id ? { userId: user.id } : "skip"
  );

  // Convert Convex images to history format (add 'id' field from '_id')
  const history = images?.map(img => ({
    ...img,
    id: img._id,
  })) || [];

  // Free Image Generation using Pollinations.ai
  const handleGenerate = async () => {
    if (!prompt || !user?.id) return;

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
      url: aiImage,
      prompt: prompt,
      aspectRatio: aspectRatio,
      timestamp: new Date().toISOString(),
    };

    // Save to Convex database
    try {
      await saveImage({
        userId: user.id,
        ...newImage,
      });
    } catch (error) {
      console.error('Failed to save image:', error);
    }

    setCurrentImage({ ...newImage, id: Date.now() });
    setIsGenerating(false);
  };

  const handleSelectHistory = (image) => {
    setCurrentImage(image);
    setPrompt(image.prompt);
    setAspectRatio(image.aspectRatio);
  };

  const handleDeleteHistory = async (imageId) => {
    try {
      await deleteImage({ imageId });
      // If the deleted image is currently displayed, clear it
      if (currentImage?.id === imageId) {
        setCurrentImage(null);
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  return (
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
            onDeleteHistory={handleDeleteHistory}
          />
        } />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="chat" element={
          <Chat
            currentImage={currentImage}
            messages={chatMessages}
            setMessages={setChatMessages}
          />
        } />
      </Route>
    </Routes>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

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
                <AppContent />
              </SignedIn>
            </>
          )}
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

