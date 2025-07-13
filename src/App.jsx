

import React, { useState } from 'react';
import { Download, Image, Loader2, Sparkles } from 'lucide-react';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState('stabilityai/stable-diffusion-xl-base-1.0');

  const models = [
    { id: 'stabilityai/stable-diffusion-xl-base-1.0', name: 'Stable Diffusion XL' },
    { id: 'runwayml/stable-diffusion-v1-5', name: 'Stable Diffusion v1.5' },
    { id: 'stabilityai/stable-diffusion-2-1', name: 'Stable Diffusion 2.1' },
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedImage(null);

    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${selectedModel}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_HF_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'image/png'
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              num_inference_steps: 30,
              guidance_scale: 7.5,
              width: 512,
              height: 512,
            }
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Image generation failed (Status: ${response.status})`);
      }

      const blob = await response.blob();
      setGeneratedImage(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message.includes('loading') 
        ? 'Model is loading, please try again in 20 seconds' 
        : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `ai-art-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">AI Image Generator</h1>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-gray-300">Transform your ideas into stunning visuals</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id} className="bg-gray-800">
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Prompt <span className="text-red-400">*</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A beautiful sunset over mountains..."
              className="w-full p-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="3"
            />
          </div>

          <div className="mb-6">
            <button
              onClick={generateImage}
              disabled={isLoading || !prompt.trim()}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Image className="w-5 h-5" />
                  Generate Image
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200">
              {error}
            </div>
          )}

          {generatedImage && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Your Creation</h3>
                <button
                  onClick={downloadImage}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
              <div className="relative group">
                <img
                  src={generatedImage}
                  alt={`AI generated: ${prompt}`}
                  className="w-full rounded-xl shadow-2xl border-2 border-white/30 transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl" />
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>Note: First request may take 20-30 seconds while the model loads</p>
        </div>
      </div>
    </div>
  );
};

export default App;