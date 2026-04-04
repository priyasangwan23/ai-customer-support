import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Bot, Mail, Palette, MessageCircle, Shield, Globe, Check } from 'lucide-react';

const Settings = () => {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('chatSettings');
    if (saved) return JSON.parse(saved);
    return {
      chatbotName: 'SupportSense Assistant',
      supportEmail: 'support@example.com',
      theme: 'dark',
      botPersona: 'friendly',
      autoReply: true,
      confidenceThreshold: 75,
      language: 'english'
    };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggleTheme = () => {
    setFormData(prev => {
      const newTheme = prev.theme === 'dark' ? 'light' : 'dark';
      if (newTheme === 'light') {
        document.documentElement.classList.add('theme-light');
      } else {
        document.documentElement.classList.remove('theme-light');
      }
      return { ...prev, theme: newTheme };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call using local state only
    setTimeout(() => {
      localStorage.setItem('chatSettings', JSON.stringify(formData));
      window.dispatchEvent(new Event('settingsUpdated'));
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Reset success state
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-8 py-8 relative bg-dashboard-settings">
      {/* Background ambient glow matching the main theme */}
        
      <header className="mb-10 z-10 relative">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-white mb-2 flex items-center"
        >
          Configuration <Shield className="ml-3 text-blue-500" size={26} />
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-sm"
        >
          Manage your AI assistant's persona, routing rules, and appearance.
        </motion.p>
      </header>

      <form onSubmit={handleSave} className="max-w-4xl space-y-8 z-10 relative pb-10">
        
        {/* Section 1: General Info */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-dashboard-card border border-dashboard-border"
        >
          <h2 className="text-lg font-bold text-gray-200 mb-6 flex items-center">
            <Bot className="mr-2 text-blue-400" size={20} /> Identity Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Chatbot Name</label>
              <input 
                type="text" 
                name="chatbotName"
                value={formData.chatbotName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g. Support Assistant"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Support Fallback Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Mail size={16} />
                </span>
                <input 
                  type="email" 
                  name="supportEmail"
                  value={formData.supportEmail}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="support@example.com"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 2: Appearance & Persona */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-dashboard-card border border-dashboard-border"
        >
          <h2 className="text-lg font-bold text-gray-200 mb-6 flex items-center">
            <Palette className="mr-2 text-blue-400" size={20} /> Interface & Tone
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Theme Preference</label>
              <div className="flex items-center">
                <button 
                  type="button"
                  onClick={handleToggleTheme}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${formData.theme === 'dark' ? 'bg-blue-600' : 'bg-gray-600'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.theme === 'dark' ? 'translate-x-8' : 'translate-x-1'}`} />
                </button>
                <span className="ml-3 text-sm text-gray-300 capitalize">{formData.theme} Mode</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Bot Persona</label>
              <select 
                name="botPersona"
                value={formData.botPersona}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                style={{ appearance: 'none' }}
              >
                <option value="professional">Professional & Direct</option>
                <option value="friendly">Friendly & Helpful</option>
                <option value="casual">Casual & Witty</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Section 3: Advanced AI Config */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-dashboard-card border border-dashboard-border"
        >
          <h2 className="text-lg font-bold text-gray-200 mb-6 flex items-center">
            <MessageCircle className="mr-2 text-emerald-400" size={20} /> AI behavior
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-700 rounded-xl p-4 bg-gray-800/30">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-gray-200">Enable Auto-Reply</p>
                  <p className="text-xs text-gray-500 mt-1">Bot replies automatically when a match is found.</p>
                </div>
                <div className="relative">
                  <input type="checkbox" name="autoReply" className="sr-only" checked={formData.autoReply} onChange={handleChange} />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${formData.autoReply ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.autoReply ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Confidence Threshold ({formData.confidenceThreshold}%)</label>
              <input 
                type="range" 
                name="confidenceThreshold" 
                min="0" max="100" 
                value={formData.confidenceThreshold} 
                onChange={handleChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: '#3B82F6' }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>More Answers</span>
                <span>More Accurate</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Primary Language</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Globe size={16} />
                </span>
                <select 
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ appearance: 'none' }}
                >
                  <option value="english">English (US)</option>
                  <option value="spanish">Spanish (ES)</option>
                  <option value="french">French (FR)</option>
                  <option value="german">German (DE)</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSaving}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
              saveSuccess 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 border border-blue-500/50'
            }`}
          >
            {isSaving ? (
              <span className="flex items-center"><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" /> Saving...</span>
            ) : saveSuccess ? (
              <span className="flex items-center"><Check size={18} className="mr-2" /> Settings Saved!</span>
            ) : (
              <span className="flex items-center"><Save size={18} className="mr-2" /> Save Configuration</span>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
