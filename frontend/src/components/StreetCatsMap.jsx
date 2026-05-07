import { useEffect, useRef, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function StreetCatsMap({ refreshTrigger, onSelectCat }) {
  const mapRef = useRef(null);
  const markersLayerRef = useRef(L.layerGroup());

  // Definiamo l'icona personalizzata per i gatti[cite: 9]
  const blueArrowIcon = useMemo(() => L.divIcon({
    className: 'custom-arrow-marker',
    html: `<div style="width: 0; height: 0; border-left: 12px solid transparent; border-right: 12px solid transparent; border-top: 20px solid #007bff; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5));"></div>`,
    iconSize: [24, 20],
    iconAnchor: [12, 20] 
  }), []);

  // 1. Inizializzazione della mappa[cite: 9]
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map-display').setView([41.8902, 12.4922], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
      
      markersLayerRef.current.addTo(mapRef.current);
    }
  }, []);

  // 2. Caricamento dei dati e gestione dei Popup[cite: 8, 9]
 // --- DENTRO StreetCatsMap.jsx ---

useEffect(() => {
  const loadCats = async () => {
    try {
      // Sostituiamo la chiamata Supabase con la chiamata al tuo Back-end
      const response = await fetch('http://localhost:5000/api/cats');
      if (!response.ok) throw new Error("Errore nel recupero dati dal server");
      
      const data = await response.json();

      if (data && mapRef.current) {
        markersLayerRef.current.clearLayers(); 

        data.forEach(cat => {
          const lat = parseFloat(cat.lat);
          const lng = parseFloat(cat.lng);

          if (!isNaN(lat) && !isNaN(lng)) {
            const marker = L.marker([lat, lng], { icon: blueArrowIcon });
            
            const popupContent = document.createElement('div');
            popupContent.className = 'map-tooltip';
            popupContent.innerHTML = `
              <div style="text-align: center; color: #333;">
                <img src="${cat.image_url}" alt="${cat.title}" style="width: 100px; height: 80px; object-fit: cover; border-radius: 5px; margin-bottom: 5px;" />
                <h4 style="margin: 5px 0;">${cat.title}</h4>
                <button id="view-cat-${cat.id}" style="background: #ff4757; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%;">
                  Vedi Dettagli
                </button>
              </div>
            `;

            marker.bindPopup(popupContent);

            marker.on('popupopen', () => {
              const btn = document.getElementById(`view-cat-${cat.id}`);
              if (btn) {
                btn.onclick = () => onSelectCat(cat); 
              }
            });
            
            marker.addTo(markersLayerRef.current);
          }
        });
      }
    } catch (error) {
      console.error("Errore:", error.message);
    }
  };

  loadCats();
}, [refreshTrigger, onSelectCat, blueArrowIcon]);

  return <div id="map-display" style={{ width: '100%', height: '100%' }}></div>;
}