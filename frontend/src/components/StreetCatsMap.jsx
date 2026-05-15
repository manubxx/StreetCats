import { useEffect, useRef, useMemo } from 'react';
import { catService } from '../services/catService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


export default function StreetCatsMap({ refreshTrigger, onSelectCat }) {
  const mapRef = useRef(null);
  const markersLayerRef = useRef(L.layerGroup());

  // icona personalizzata per i gatti
  const blueArrowIcon = useMemo(() => L.divIcon({
    className: 'custom-arrow-marker',
    html: `<div style="width: 0; height: 0; border-left: 12px solid transparent; border-right: 12px solid transparent; border-top: 20px solid #007bff; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5));"></div>`,
    iconSize: [24, 20],
    iconAnchor: [12, 20] 
  }), []);

  //  Inizializzazione della mappa
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map-display').setView([41.8902, 12.4922], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'OpenStreetMap contributors'
      }).addTo(mapRef.current);
      
      markersLayerRef.current.addTo(mapRef.current);
    }
  }, []);

  // Caricamento dei dati

useEffect(() => {
  const loadCats = async () => {
    try {

      const data = await catService.getAllCats();

      if (data && mapRef.current) {
        markersLayerRef.current.clearLayers(); 

        data.forEach(cat => {
          const lat = parseFloat(cat.lat);
          const lng = parseFloat(cat.lng);

          if (!isNaN(lat) && !isNaN(lng)) {
            const marker = L.marker([lat, lng], { icon: blueArrowIcon });
            
          
            const container = document.createElement('div');
            container.className = 'map-tooltip';
            container.innerHTML = `
              <div style="text-align: center; color: #333;">
                <img src="${cat.image_url}" alt="${cat.title}" style="width: 100px; height: 80px; object-fit: cover; border-radius: 5px; margin-bottom: 5px;" />
                <h4 style="margin: 5px 0;">${cat.title}</h4>
                <button id="view-cat-${cat.id}" class="view-btn" style="background: #ff4757; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%;">
                  Vedi Dettagli
                </button>
              </div>
            `;

            marker.bindPopup(container);

            marker.on('popupopen', () => {
              const btn = document.getElementById(`view-cat-${cat.id}`);
              if (btn) btn.onclick = () => onSelectCat(cat); 
            });
            
            marker.addTo(markersLayerRef.current);
          }
        });
      }
    } catch (error) {
      console.error("Errore caricamento gatti:", error.message);
    }
  };

  loadCats();
}, [refreshTrigger, onSelectCat, blueArrowIcon]);

  return <div id="map-display" style={{ width: '100%', height: '100%' }}></div>;
}