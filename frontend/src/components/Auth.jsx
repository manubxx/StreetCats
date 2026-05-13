import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert("Errore Login: " + error.message)
    else alert("Login effettuato!")
    setLoading(false)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert("Errore Registrazione: " + error.message)
    else alert("Registrazione completata!")
    setLoading(false)
  }

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '10px auto', 
      padding: '20px', 
      borderRadius: '10px', 
      backgroundColor: 'transparent', 
      color: '#e0e0e0' 
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: '#ff4757', 
        marginBottom: '20px' 
      }}>
        Accedi a StreetCats
      </h2>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Tua Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ 
            padding: '12px', 
            borderRadius: '5px', 
            border: '1px solid #444', 
            backgroundColor: '#1a1a1a', 
            color: 'white' 
          }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={{ 
            padding: '12px', 
            borderRadius: '5px', 
            border: '1px solid #444', 
            backgroundColor: '#1a1a1a', 
            color: 'white' 
          }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleLogin} 
            disabled={loading} 
            style={{ 
              flex: 1, 
              padding: '12px', 
              backgroundColor: '#ff4757', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Accedi
          </button>
          <button 
            onClick={handleSignUp} 
            disabled={loading} 
            style={{ 
              flex: 1, 
              padding: '12px', 
              backgroundColor: 'transparent', 
              color: '#ff4757', 
              border: '2px solid #ff4757', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Registrati
          </button>
        </div>
      </form>
    </div>
  )
}