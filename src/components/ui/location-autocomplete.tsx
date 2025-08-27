'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface Prediction {
  description: string;
  place_id: string;
}

export default function LocationAutocomplete({ 
  value, 
  onChange, 
  placeholder = "Enter location...",
  className = "" 
}: LocationAutocompleteProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        const { Loader } = await import('@googlemaps/js-api-loader');
        
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();
        
        if (window.google && window.google.maps && window.google.maps.places) {
          autocompleteRef.current = new window.google.maps.places.AutocompleteService();
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    loadGoogleMaps();
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length > 2 && autocompleteRef.current) {
      setIsLoading(true);
      try {
        const predictions = await new Promise<Prediction[]>((resolve, reject) => {
          autocompleteRef.current.getPlacePredictions(
            { input: inputValue },
            (predictions: any[], status: any) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                resolve(predictions);
              } else {
                reject(status);
              }
            }
          );
        });
        
        setPredictions(predictions);
        setShowPredictions(true);
      } catch (error) {
        console.error('Error getting predictions:', error);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  const handlePredictionClick = (prediction: Prediction) => {
    onChange(prediction.description);
    setPredictions([]);
    setShowPredictions(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setShowPredictions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setShowPredictions(predictions.length > 0)}
          className={`pl-10 ${className}`}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
        )}
      </div>

      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction, index) => (
            <div
              key={prediction.place_id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handlePredictionClick(prediction)}
            >
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{prediction.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}