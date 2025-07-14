import React, { useState, useEffect } from 'react';
import { Download, Loader2, Sparkles, Palette, Wand2, Zap, Star, Heart } from 'lucide-react';


const App = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState('stabilityai/stable-diffusion-xl-base-1.0');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [glowParticles, setGlowParticles] = useState([]);

  const models = [
    { id: 'stabilityai/stable-diffusion-xl-base-1.0', name: 'Cosmic XL', gradient: 'from-purple-500 to-pink-500', icon: '🌌' },
    // { id: 'runwayml/stable-diffusion-v1-5', name: 'Neon Dreams', gradient: 'from-cyan-500 to-blue-500', icon: '⚡' },
    // { id: 'stabilityai/stable-diffusion-2-1', name: 'Aurora', gradient: 'from-emerald-500 to-teal-500', icon: '🌟' },
  ];

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate magical particles
  useEffect(() => {
    const generateGlowParticles = () => {
      const particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.3,
          speed: Math.random() * 2 + 1,
          color: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 5)],
        });
      }
      setGlowParticles(particles);
    };
    generateGlowParticles();
  }, []);

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('✨ Please paint your vision with words');
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
        throw new Error(errorData.error || `Generation failed (Status: ${response.status})`);
      }

      const blob = await response.blob();
      setGeneratedImage(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message.includes('loading') 
        ? '🎨 Model is awakening, try again in 20 seconds' 
        : `💫 ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `sketi-masterpiece-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.2) 25%, rgba(0, 0, 0, 0.8) 50%)`,
        }}
      />
      
      {/* Animated Mesh Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20 animate-gradient-shift" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(139,92,246,0.3)_0%,transparent_50%)] animate-pulse-slow" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.3)_0%,transparent_50%)] animate-pulse-slow animation-delay-1000" />
        <div className="absolute bottom-0 left-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.2)_0%,transparent_50%)] animate-pulse-slow animation-delay-2000" />
      </div>

      {/* Floating Glow Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {glowParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-float-glow"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 4}px ${particle.color}`,
              animationDuration: `${particle.speed + 2}s`,
              animationDelay: `${particle.id * 0.1}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-16">
            <div className="relative inline-block">
              <h1 className=" caveat text-6xl sm:text-8xl lg:text-9xl font-black bg-gradient-to-r from-purple-400 via-pink-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient-text mb-4">
                -Sketi-
              </h1>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 blur-xl animate-pulse" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-20 blur-3xl animate-pulse animation-delay-500" />
            </div>
            <p className="  text-xl sm:text-2xl lg:text-3xl text-gray-300 font-light mb-8 animate-fade-in-up animation-delay-1000">
              Where imagination meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">infinite creativity</span>
            </p>
            {/* <div className="flex justify-center gap-4 animate-fade-in-up animation-delay-1500">
              <Star className="w-8 h-8 text-yellow-400 animate-twinkle" />
              <Heart className="w-8 h-8 text-pink-400 animate-pulse" />
              <Zap className="w-8 h-8 text-cyan-400 animate-bounce" />
            </div> */}
          </div>

          {/* Main Interface */}
          <div className="bg-white/5 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8 lg:p-12 animate-slide-up animation-delay-2000 relative overflow-hidden">
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 p-[1px] animate-gradient-rotate">
              <div className="h-full w-full rounded-3xl bg-black/80 backdrop-blur-3xl" />
            </div>
            
            <div className="relative z-10">
              {/* Model Selection */}
              {/* <div className="mb-8 sm:mb-12">
                <label className="block text-white text-lg sm:text-xl font-bold mb-6 flex items-center gap-3">
                  <Palette className="w-6 h-6 text-purple-400" />
                  Choose Your Artistic Universe
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`group relative p-6 sm:p-8 rounded-2xl border-2 transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                        selectedModel === model.id
                          ? 'border-purple-400 bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-2xl shadow-purple-500/25'
                          : 'border-white/20 bg-white/5 hover:border-purple-400/50 hover:bg-white/10'
                      }`}
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" 
                           style={{ background: `linear-gradient(135deg, ${model.gradient.replace('from-', '').replace('to-', '').replace(' ', ', ')})` }} />
                      <div className="relative z-10">
                        <div className="text-4xl sm:text-5xl mb-4 animate-float">{model.icon}</div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{model.name}</h3>
                        <div className={`w-full h-1 rounded-full bg-gradient-to-r ${model.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Prompt Input */}
              <div className="mb-8 sm:mb-12">
                <label className=" text-white text-lg sm:text-xl font-bold mb-6 flex items-center gap-3">
                  <Wand2 className="w-6 h-6 text-pink-400" />
                  Paint Your Vision
                  <span className="text-purple-400 animate-pulse">*</span>

                </label>
                <div className="relative group">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A mystical phoenix rising from cosmic flames."
                    className="w-full p-6 sm:p-8 bg-white/10 border-2 border-white/20 rounded-2xl text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 resize-none transition-all duration-300 hover:bg-white/15 group-hover:shadow-xl group-hover:shadow-purple-500/10"
                    rows="4"
                  />
                  <div className="absolute bottom-4 right-4 text-gray-400 text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                    {prompt.length}/1000
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-xl" />
                </div>
              </div>

              {/* Generate Button */}
              <div className="mb-8 sm:mb-12">
                <button
                  onClick={generateImage}
                  disabled={isLoading || !prompt.trim()}
                  className="w-full relative group py-6 sm:py-8 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xl sm:text-2xl font-bold rounded-2xl transition-all duration-500 overflow-hidden hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 animate-gradient-x" />
                  <div className="relative z-10 flex items-center justify-center gap-4">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className="animate-pulse">Crafting Magic...</span>
                      </>
                    ) : (
                      <>
                        {/* <Sparkles className="w-8 h-8 animate-bounce" /> */}
                        Generate Art
                        {/* <Sparkles className="w-8 h-8 animate-bounce animation-delay-500" /> */}
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-8 p-6 bg-red-500/20 border-2 border-red-500/50 rounded-2xl text-red-200 animate-shake backdrop-blur-sm">
                  <div className="flex items-center gap-3 text-lg">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                    {error}
                  </div>
                </div>
              )}

              {/* Generated Image */}
              {generatedImage && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                      <Star className="w-8 h-8 text-yellow-400 animate-twinkle" />
                      Your Masterpiece
                    </h3>
                    <button
                      onClick={downloadImage}
                      className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25"
                    >
                      <Download className="w-5 h-5 group-hover:animate-bounce" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-cyan-500/50 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                    <div className="relative">
                      <img
                        src={generatedImage}
                        alt={`Sketi creation: ${prompt}`}
                        className="w-full rounded-2xl shadow-2xl border-4 border-white/20 transition-all duration-700 group-hover:scale-105 group-hover:shadow-purple-500/25"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="prata-regular text-center mt-8 sm:mt-16 text-gray-400 animate-fade-in animation-delay-3000">
            <p className="text-sm underline flex items-center justify-center gap-3">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              First magic spell takes 10-20 seconds to cast
              <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse animation-delay-500" />
            </p>
          </div>
          <div className=" caveat text-center mt-20 sm:mt-16 text-gray-400 animate-fade-in animation-delay-3000">
            <p className="text-lg flex items-center justify-center gap-3">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              Developed & Designed by Sooraj.
              {/* <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse animation-delay-500" /> */}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-text {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-x {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        

        
        @keyframes float-glow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        .animate-gradient-shift {
          background-size: 400% 400%;
          animation: gradient-shift 8s ease infinite;
        }
        
        .animate-gradient-text {
          background-size: 400% 400%;
          animation: gradient-text 3s ease infinite;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-gradient-rotate {
          animation: gradient-rotate 4s linear infinite;
        }
        
        .animate-float-glow {
          animation: float-glow 4s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
      `}</style>
    </div>
  );
};

export default App;