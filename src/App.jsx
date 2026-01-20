import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Layout } from './components/Layout';
import { Studio } from './components/Studio';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { HelpSupport } from './components/HelpSupport';
import { Chat } from './components/Chat';
import { Gallery } from './components/Gallery';
import './App.css';
import { ThemeProvider } from "./components/theme-provider"
import { SplashScreen } from './components/SplashScreen';
import { LandingPage } from './components/LandingPage';

function AppContent() {
  const { user } = useUser();
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');

  // Advanced Settings State
  const [negativePrompt, setNegativePrompt] = useState('');
  const [numImages, setNumImages] = useState(1);
  const [steps, setSteps] = useState(30);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(''); // For "1 of 4" status

  const [currentImage, setCurrentImage] = useState(null);

  // Convex queries and mutations for images
  const saveImage = useMutation(api.images.saveImage);
  const deleteImage = useMutation(api.images.deleteImage);
  const images = useQuery(api.images.getImages,
    user?.id ? { userId: user.id } : "skip"
  );

  // Convex queries and mutations for chat
  const saveChatMessage = useMutation(api.chat.saveMessage);
  const clearChatMessages = useMutation(api.chat.clearMessages);
  const chatMessagesFromDb = useQuery(api.chat.getMessages,
    user?.id ? { userId: user.id } : "skip"
  );

  // Convert Convex chat messages to format with 'id' field
  const chatMessages = chatMessagesFromDb?.map(msg => ({
    ...msg,
    id: msg._id,
  })) || [{ id: 'welcome', role: 'bot', text: 'Hello! Generate an image in the Studio, then ask me anything about it!' }];

  // Convert Convex images to history format (add 'id' field from '_id')
  const history = images?.map(img => ({
    ...img,
    id: img._id,
  })) || [];

  // Free Image Generation using Pollinations.ai
  const handleGenerate = async () => {
    if (!prompt || !user?.id) return;

    setIsGenerating(true);
    setGenerationProgress('Starting generation...');

    // Determine image dimensions based on aspect ratio
    let width = 1024;
    let height = 1024;
    if (aspectRatio === '16:9') { width = 1600; height = 900; }
    else if (aspectRatio === '9:16') { width = 900; height = 1600; }

    // Prepare prompt
    let finalPrompt = prompt;
    if (negativePrompt) {
      finalPrompt += ` --no ${negativePrompt}`;
    }

    try {
      for (let i = 0; i < numImages; i++) {
        if (numImages > 1) {
          setGenerationProgress(`Generating ${i + 1} of ${numImages}...`);
        }

        const seed = Math.floor(Math.random() * 1000000) + i; // Ensure different seeds
        // Using the primary Pollinations endpoint which redirects/handles requests better
        const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(finalPrompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

        // const response = await fetch(imageUrl);
        // const blob = await response.blob();
        // In a real app we'd upload this blob. For now, Pollinations URL is persistent enough for MVP or we rely on it.
        // Removing strict fetch check to avoid CORS/429 blocking the UI flow.

        const newImage = {
          url: imageUrl,
          prompt: finalPrompt,
          aspectRatio,
          timestamp: new Date().toISOString()
        };

        setCurrentImage(newImage);

        // Save to Convex
        await saveImage({
          userId: user.id,
          url: imageUrl,
          prompt: finalPrompt,
          aspectRatio: aspectRatio,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  const handleSelectHistory = (historyItem) => {
    setCurrentImage(historyItem);
    // Optionally restore prompt settings?
    // setPrompt(historyItem.prompt); 
  };

  const handleDeleteHistory = async (id) => {
    try {
      await deleteImage({ imageId: id });
      if (currentImage?.id === id) {
        setCurrentImage(null);
      }
    } catch (e) {
      console.error("Failed to delete", e);
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={
          <Studio
            prompt={prompt}
            setPrompt={setPrompt}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}

            // Advanced props
            negativePrompt={negativePrompt}
            setNegativePrompt={setNegativePrompt}
            numImages={numImages}
            setNumImages={setNumImages}
            steps={steps}
            setSteps={setSteps}
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
            generationProgress={generationProgress}

            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            currentImage={currentImage}
            history={history}
            onSelectHistory={handleSelectHistory}
            onDeleteHistory={handleDeleteHistory}
          />
        } />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="help" element={<HelpSupport />} />
        <Route path="chat" element={
          <Chat
            currentImage={currentImage}
            messages={chatMessages}
            onSaveMessage={saveChatMessage}
            onClearMessages={clearChatMessages}
            userId={user?.id}
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
                <LandingPage />
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

