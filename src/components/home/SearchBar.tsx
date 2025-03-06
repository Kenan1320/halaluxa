
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
    <div className="w-full max-w-5xl mx-auto">
      <form onSubmit={handleSearch} className="relative flex">
        <input
          type="text"
          placeholder="Search Haluna"
          className="py-2.5 px-4 w-full rounded-l-md border-none focus:ring-0 flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="absolute right-16 top-0 h-full flex items-center px-2">
          <button 
            type="button" 
            className={`p-1.5 rounded-full ${isRecording ? 'bg-red-100' : ''}`}
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
        
        <button 
          type="submit" 
          className="bg-orange-400 hover:bg-orange-500 px-4 flex items-center justify-center rounded-r-md"
        >
          <Search className="h-5 w-5 text-zinc-800" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
