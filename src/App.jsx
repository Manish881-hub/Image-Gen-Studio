import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { useQuery, useMutation, useAction } from 'convex/react';
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
import { IMAGE_MODELS } from './lib/constants';

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

  // Model & API State
  const [model, setModel] = useState(IMAGE_MODELS.POLLINATIONS.id);
  const [nvidiaApiKey, setNvidiaApiKey] = useState(() => import.meta.env.VITE_NVIDIA_API_KEY || sessionStorage.getItem('nvidia_key') || '');
  const [nvidiaEndpoint, setNvidiaEndpoint] = useState(IMAGE_MODELS.SD3_5.defaultEndpoint);

  // Save key to session storage when changed
  if (nvidiaApiKey) sessionStorage.setItem('nvidia_key', nvidiaApiKey);

  const [currentImage, setCurrentImage] = useState(null);

  // Convex queries and mutations for images
  // Convex queries and mutations for images
  const saveImage = useMutation(api.images.saveImage);
  const deleteImage = useMutation(api.images.deleteImage);
  const generateImageAction = useAction(api.images.generateSD35Image);
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
      if (model === IMAGE_MODELS.POLLINATIONS.id) {
        // --- POLLINATIONS LOGIC ---
        for (let i = 0; i < numImages; i++) {
          if (numImages > 1) setGenerationProgress(`Generating ${i + 1} of ${numImages}...`);

          const seed = Math.floor(Math.random() * 1000000) + i;
          const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(finalPrompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

          await handleImageResult(imageUrl, finalPrompt, aspectRatio);
        }

      } else if (model === IMAGE_MODELS.SD3_5.id) {
        // --- NVIDIA / SD3.5 LOGIC ---
        if (!nvidiaApiKey && !nvidiaEndpoint.includes('localhost')) {
          alert("Please enter a valid NVIDIA API Key in the settings.");
          setIsGenerating(false);
          return;
        }

        for (let i = 0; i < numImages; i++) {
          if (numImages > 1) setGenerationProgress(`Generating ${i + 1} of ${numImages}...`);

          const seed = Math.floor(Math.random() * 1000000); // Random seed for new variation

          // Call Server-Side Action (Bypasses CORS)
          const base64Img = await generateImageAction({
            prompt: prompt,
            apiKey: nvidiaApiKey,
            endpoint: nvidiaEndpoint,
            steps: steps,
            seed: seed,
            aspectRatio: aspectRatio
          });

          if (base64Img) {
            const imageUrl = `data:image/jpeg;base64,${base64Img}`;
            await handleImageResult(imageUrl, finalPrompt, aspectRatio);
          } else {
            throw new Error("No image data received from API");
          }
        }
      }

    } catch (error) {
      console.error("Generation failed:", error);
      alert(`Failed to generate image: ${error.message}`);
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  const handleImageResult = async (url, prompt, ratio) => {
    const newImage = {
      url: url,
      prompt: prompt,
      aspectRatio: ratio,
      timestamp: new Date().toISOString()
    };
    setCurrentImage(newImage);

    // Save to Convex
    // Note: Data URIs can be large. If this fails, the UI still updates.
    try {
      await saveImage({
        userId: user.id,
        url: url,
        prompt: prompt,
        aspectRatio: ratio,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.warn("Failed to save to history (likely too large):", e);
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

            model={model}
            setModel={setModel}
            nvidiaApiKey={nvidiaApiKey}
            setNvidiaApiKey={setNvidiaApiKey}
            nvidiaEndpoint={nvidiaEndpoint}
            setNvidiaEndpoint={setNvidiaEndpoint}
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

