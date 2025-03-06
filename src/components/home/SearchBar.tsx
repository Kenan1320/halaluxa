
import { useState } from 'react';
import { Search, Mic, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch?: (term: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (onSearch) {
        onSearch(searchTerm);
      } else {
        navigate(`/browse?search=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  const startVoiceSearch = () => {
    setIsRecording(true);
    
    // Check if the browser supports the Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore - TypeScript doesn't have types for the Web Speech API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        setIsRecording(false);
        
        // Auto submit after voice input
        if (transcript.trim()) {
          if (onSearch) {
            onSearch(transcript);
          } else {
            navigate(`/browse?search=${encodeURIComponent(transcript)}`);
          }
        }
      };
      
      recognition.onerror = () => {
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognition.start();
    } else {
      alert('Voice search is not supported in your browser.');
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center w-full">
          <div className="absolute left-4">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            type="text"
            placeholder="Search or ask a question"
            className="pl-12 pr-24 py-3.5 w-full rounded-full border-none shadow-md focus:ring-2 focus:ring-orange-300 bg-white text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="absolute right-4 flex items-center space-x-2">
            <button 
              type="button" 
              className="bg-transparent p-1.5 rounded-full hover:bg-gray-100"
              onClick={() => {}}
            >
              <Camera className="h-5 w-5 text-gray-500" />
            </button>
            
            <button 
              type="button" 
              className={`bg-transparent p-1.5 rounded-full ${isRecording ? 'bg-red-100' : 'hover:bg-gray-100'}`}
              onClick={startVoiceSearch}
            >
              <Mic className={`h-5 w-5 ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
              {isRecording && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-red-100 z-[-1]"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
