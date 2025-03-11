
import { useState, useEffect } from 'react';
import { Search, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch?: (term: string) => void;
  placeholderText?: string;
  rotatingTexts?: string[];
}

const SearchBar = ({ 
  onSearch, 
  placeholderText = "Search Haluna", 
  rotatingTexts = [] 
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholderText);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const navigate = useNavigate();

  // Setup rotating placeholder text
  useEffect(() => {
    if (!rotatingTexts || rotatingTexts.length === 0) return;

    let mainTextTimeoutId: NodeJS.Timeout;
    let rotatingTextTimeoutId: NodeJS.Timeout;
    
    const rotateText = () => {
      // Show main text for 30 seconds
      setCurrentPlaceholder(placeholderText);
      
      mainTextTimeoutId = setTimeout(() => {
        // Start rotating through other texts
        const rotateOtherTexts = (index: number) => {
          setCurrentPlaceholder(rotatingTexts[index]);
          setPlaceholderIndex((index + 1) % rotatingTexts.length);
          
          // Each rotating text shows for 3 seconds
          rotatingTextTimeoutId = setTimeout(() => {
            if (index < rotatingTexts.length - 1) {
              rotateOtherTexts(index + 1);
            } else {
              // Start the cycle again
              rotateText();
            }
          }, 3000);
        };
        
        rotateOtherTexts(0);
      }, 30000);
    };
    
    // Start the rotation
    rotateText();
    
    // Clean up timeouts on unmount
    return () => {
      clearTimeout(mainTextTimeoutId);
      clearTimeout(rotatingTextTimeoutId);
    };
  }, [placeholderText, rotatingTexts]);

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
            <Search className="h-5 w-5 text-[#2A866A]" />
          </div>
          
          <input
            type="text"
            placeholder={currentPlaceholder}
            className="pl-12 pr-14 py-3 w-full rounded-full border-none shadow-sm focus:ring-2 focus:ring-[#2A866A]/30 bg-white text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="absolute right-4">
            <button 
              type="button" 
              className={`bg-transparent p-1.5 rounded-full ${isRecording ? 'bg-red-100' : 'hover:bg-[#2A866A]/20'}`}
              onClick={startVoiceSearch}
            >
              <Mic className={`h-5 w-5 ${isRecording ? 'text-red-500 animate-pulse' : 'text-[#2A866A]'}`} />
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
