import React from 'react';
import { Play, Info } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative h-[90vh] w-full">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      </div>
      
      <div className="relative pt-48 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-6xl font-bold text-white max-w-2xl">Interstellar</h1>
        <p className="mt-4 text-xl text-gray-300 max-w-xl">
          When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot leads a mission through a wormhole to find a new home for humanity.
        </p>
        
        <div className="mt-8 flex space-x-4">
          <button className="flex items-center px-6 py-3 bg-white text-black rounded hover:bg-gray-200 transition">
            <Play className="h-5 w-5 mr-2" />
            Play
          </button>
          <button className="flex items-center px-6 py-3 bg-gray-600/70 text-white rounded hover:bg-gray-600 transition">
            <Info className="h-5 w-5 mr-2" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}