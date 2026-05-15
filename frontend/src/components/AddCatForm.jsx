import { useState, useEffect, useRef } from 'react';
import { catService } from '../services/catService';
import { storageService } from '../services/storageService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { API_BASE_URL } from '../config';

export default function AddCatForm({ session, onCatAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState([41.8902, 12.4922]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const mapRef = useRef(null);

  const customMarkerIcon = L.divIcon({
    className: 'custom-gps-marker',
    html: `<div style="
      width: 20px; 
      height: 20px; 
      background-color: #ff4757; 
      border: 3px solid white; 
      border-radius: 50%; 
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map-form-container').setView(position, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      
      const marker = L.marker(position, { 
        draggable: true,
        icon: customMarkerIcon 
      }).addTo(map);
      
      marker.on('dragend', () => {
        const newPos = marker.getLatLng();
        setPosition([newPos.lat, newPos.lng]);
      });

      map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        setPosition([e.latlng.lat, e.latlng.lng]);
      });

      mapRef.current = map;
    }

    const refreshMap = () => {
      if (mapRef.current) {
        setTimeout(() => mapRef.current.invalidateSize(), 100);
      }
    };

    window.addEventListener('map-refresh', refreshMap);
    return () => { 
      window.removeEventListener('map-refresh', refreshMap);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [customMarkerIcon]);

  // GESTIONE IMMAGINE
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Controllo dimensione
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Il file è troppo grande. Massimo 2MB.");
      e.target.value = ""; 
      setImageFile(null);
      return;
    }

    setImageFile(file);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    let imageUrl = '';
    
    // Caricamento immagine
    if (imageFile) {
      imageUrl = await storageService.uploadCatImage(imageFile, session.user.id);
    }

    // Salvataggio gatto tramite API
    const catData = {
      title, 
      description, 
      lat: position[0], 
      lng: position[1], 
      image_url: imageUrl, 
      user_id: session.user.id
    };

    await catService.createCat(catData, session.access_token);

    // Reset form
    setTitle(''); 
    setDescription(''); 
    setImageFile(null);
    if (onCatAdded) onCatAdded();
    alert('Gatto segnalato con successo!');
  } catch (err) {
    alert("Errore: " + err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <form className="modern-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Nome del gatto..." 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        required 
      />
      <textarea 
        placeholder="Breve descrizione..." 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
      />
      
      <div className="file-input-wrapper" style={{marginBottom: '10px'}}>
        <label style={{fontSize: '0.8rem', color: '#aaa'}}>
          Aggiungi foto (Max 2MB):
        </label>
        <input 
          type="file" 
          accept="image/*"
          onChange={handleFileChange} 
          style={{border: 'none', padding: '5px 0'}}
        />
      </div>

      <div id="map-form-container"></div>
      
      <p style={{fontSize: '0.7rem', color: '#888', marginTop: '-10px', marginBottom: '10px'}}>
        * Trascina il pallino rosso sulla posizione esatta
      </p>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'INVIO IN CORSO...' : 'INVIA SEGNALAZIONE'}
      </button>
    </form>
  );
}