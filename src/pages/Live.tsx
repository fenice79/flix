import React from 'react';
import { Play } from 'lucide-react';
import Navbar from '../components/Navbar';

interface LiveChannel {
  id: number;
  title: string;
  description: string;
  currentShow: string;
  image: string;
  viewers: number;
  category: string;
}

const liveChannels: LiveChannel[] = [
  {
    id: 1,
    title: "Sport Live",
    description: "24/7 copertura sportiva in diretta",
    currentShow: "Serie A: Roma vs Inter",
    image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&q=80",
    viewers: 15420,
    category: "Sport"
  },
  {
    id: 2,
    title: "News 24",
    description: "Notizie in diretta 24 ore su 24",
    currentShow: "TG in diretta",
    image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80",
    viewers: 8750,
    category: "News"
  },
  {
    id: 3,
    title: "Musica Live",
    description: "I migliori concerti ed eventi musicali",
    currentShow: "Festival di Sanremo 2024",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80",
    viewers: 12890,
    category: "Musica"
  },
  {
    id: 4,
    title: "Gaming Central",
    description: "Streaming di eSports e gaming",
    currentShow: "Torneo CS:GO",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80",
    viewers: 9340,
    category: "Gaming"
  },
  {
    id: 5,
    title: "Cultura & Arte",
    description: "Eventi culturali in diretta",
    currentShow: "Tour Virtuale Galleria degli Uffizi",
    image: "https://images.unsplash.com/photo-1566054757965-8c4085344c96?auto=format&fit=crop&q=80",
    viewers: 5670,
    category: "Cultura"
  },
  {
    id: 6,
    title: "Cucina in Diretta",
    description: "Show culinari e ricette dal vivo",
    currentShow: "MasterChef Italia Live",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80",
    viewers: 7890,
    category: "Cucina"
  }
];

export default function Live() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">Canali Live</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveChannels.map((channel) => (
            <div 
              key={channel.id}
              className="bg-zinc-900 rounded-lg overflow-hidden transition-transform hover:scale-105"
            >
              <div className="relative">
                <img
                  src={channel.image}
                  alt={channel.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm">
                  LIVE
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {channel.viewers.toLocaleString()} spettatori
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-white">{channel.title}</h2>
                  <span className="text-sm text-gray-400 bg-zinc-800 px-2 py-1 rounded">
                    {channel.category}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-3">{channel.description}</p>
                
                <div className="mb-4">
                  <span className="text-gray-500 text-sm">In onda ora:</span>
                  <p className="text-white">{channel.currentShow}</p>
                </div>
                
                <button className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                  <Play className="w-5 h-5 mr-2" />
                  Guarda Ora
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}