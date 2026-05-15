import { API_BASE_URL } from '../config';

export const catService = {
  // Recupera tutti i gatti
  async getAllCats() {
    const response = await fetch(`${API_BASE_URL}/cats`);
    if (!response.ok) throw new Error("Errore nel recupero dei gatti dal server");
    return await response.json();
  },

  // Salva un nuovo gatto
  async createCat(catData, token) {
    const response = await fetch(`${API_BASE_URL}/cats`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(catData)
    });

    if (!response.ok) throw new Error('Errore nel salvataggio sul back-end');
    return await response.json();
  }, 
  // Recupera i commenti di un gatto
  async getComments(catId) {
    const response = await fetch(`${API_BASE_URL}/cats/${catId}/comments`);
    if (!response.ok) throw new Error("Errore fetch commenti");
    return await response.json();
  },

  // Aggiunge un nuovo commento
  async addComment(catId, content, token) {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ cat_id: catId, content: content })
    });
    
    if (!response.ok) throw new Error("Errore nell'invio del commento");
    return response.ok;
  }
};