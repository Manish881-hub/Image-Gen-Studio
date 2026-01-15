import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [history, setHistory] = useState([]);

  // Mock Generation Function
  const handleGenerate = () => {
    if (!prompt) return;

    setIsGenerating(true);

    // Simulate network delay
    setTimeout(() => {
      // For a "Real" studio feel, we'll use placeholder images that look high quality
      // In a real app, this would be the API response
      const seeds = [
        'https://images.unsplash.com/photo-1620641788421-7a1c3103428f?q=80&w=1000&auto=format&fit=crop', // Cyberpunk
        'https://images.unsplash.com/photo-1534003057528-662580a184ff?q=80&w=1000&auto=format&fit=crop', // Abstract
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop', // Liquid
        'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1000&auto=format&fit=crop', // Neon
      ];
      const randomImage = seeds[Math.floor(Math.random() * seeds.length)];

      setCurrentImage(randomImage);
      setHistory(prev => [randomImage, ...prev]);
      setIsGenerating(false);
    }, 2500); // 2.5s simulated generation time
  };

  return (
    <div className="app-container">
      <Layout
        prompt={prompt}
        setPrompt={setPrompt}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
        currentImage={currentImage}
        history={history}
      />
    </div>
  );
}

export default App;
