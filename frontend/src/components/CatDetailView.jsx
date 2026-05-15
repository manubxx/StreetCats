import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown';
import { catService } from '../services/catService'; 

export default function CatDetailView({ cat, session, onClose }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")

  // Caricamento commenti
  const fetchComments = async () => {
    try {
      const data = await catService.getComments(cat.id);
      setComments(data || []);
    } catch (err) {
      console.error("Errore fetch commenti:", err.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [cat.id]);

  // Invio commento
  async function handleSubmitComment(e) {
    e.preventDefault();
    if (!newComment.trim() || !session) return;

    try {
     
      await catService.addComment(cat.id, newComment, session.access_token);
      
      setNewComment("");
      fetchComments(); 
    } catch (err) {
      alert("Errore nell'invio del commento: " + err.message);
    }
  }

  return (
    <div className="cat-detail-overlay">
      <div className="detail-content-card">
        <button className="close-overlay-btn" onClick={onClose}>X</button>
        
        <div className="visual-column">
          <img src={cat.image_url} alt={cat.title} />
          <div style={{padding: '20px', color: '#aaa', fontSize: '0.8rem'}}>
            <p>📍 Coordinate: {cat.lat}, {cat.lng}</p>
            <p> Segnalato il: {new Date(cat.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="info-column">
          <h1>{cat.title}</h1>
          <div className="description-box">
            <ReactMarkdown>{cat.description}</ReactMarkdown>
          </div>

          <div className="comments-section">
            <h3>Commenti ({comments.length})</h3>
            <div className="comment-list">
              {comments.length === 0 && <p style={{color: '#666'}}>Nessun commento ancora.</p>}
              {comments.map(c => (
                <div key={c.id} className="comment-item">
                  {}
                  <b>{c.user_email ? c.user_email.split('@')[0] : 'Utente'}: </b>
                  {c.content}
                </div>
              ))}
            </div>

            {session ? (
              <form onSubmit={handleSubmitComment} className="comment-form">
                <input 
                  type="text" 
                  placeholder="Aggiungi un commento..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#333', border: '1px solid #444', color: 'white' }}
                />
              </form>
            ) : (
              <p style={{fontSize: '0.8rem', color: '#ffa502'}}>
                Accedi per commentare.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}