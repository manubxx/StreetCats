import { useState, useEffect } from 'react'
import { supabase } from './services/supabaseClient'
import Auth from './components/Auth'
import AddCatForm from './components/AddCatForm' 
import StreetCatsMap from './components/StreetCatsMap'
import CatDetailView from './components/CatDetailView' 
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedCat, setSelectedCat] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  const handleCatAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  }

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div className="logo">🐈 STREETCATS</div>
        {session ? (
          <div className="user-info-container">
            <span className="user-email">{session.user.email}</span>
            <button className="logout-btn" onClick={() => supabase.auth.signOut()}>ESCI</button>
          </div>
        ) : (
          <div className="guest-msg">Esplora la mappa dei gatti</div>
        )}
      </nav>

      <main className="main-content">
        <div className="dashboard-layout">
          <div className="map-section">
            <StreetCatsMap 
              refreshTrigger={refreshTrigger} 
              onSelectCat={setSelectedCat} 
            />
          </div>
          
          <div className="side-panel">
            {session ? (
              <details 
                className="dropdown-form" 
                onToggle={(e) => {
                  if (e.target.open) {
                    // Ricacalcola le dimensioni dopo l'apertura della minimappa
                    setTimeout(() => {
                      window.dispatchEvent(new Event('map-refresh'));
                      window.dispatchEvent(new Event('resize'));
                    }, 150);
                  }
                }}
              >
                <summary> NUOVA SEGNALAZIONE</summary>
                <div className="dropdown-content">
                  <AddCatForm session={session} onCatAdded={handleCatAdded} />
                </div>
              </details>
            ) : (
              <div className="auth-card">
                <p style={{textAlign: 'center', marginBottom: '10px'}}>Accedi per segnalare un gatto</p>
                <Auth />
              </div>
            )}
          </div>
        </div>

        {selectedCat && (
          <CatDetailView 
            cat={selectedCat} 
            session={session} 
            onClose={() => setSelectedCat(null)} 
          />
        )}
      </main>
    </div>
  )
}

export default App