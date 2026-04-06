import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState('')
  const [resending, setResending] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const continueWithoutLogin = () => {
    try {
      sessionStorage.setItem('contista.auth.preview_bypass', '1')
      localStorage.removeItem('contista.auth.bypass')
    } catch {
      // Ignore storage failures.
    }
    navigate('/dashboard')
  }

  const handleResendConfirmation = async () => {
    const targetEmail = pendingConfirmationEmail || email
    if (!targetEmail) {
      setError('Ange e-post för att skicka bekräftelse igen.')
      return
    }

    setError('')
    setSuccess('')
    setResending(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: targetEmail,
        options: { emailRedirectTo: `${window.location.origin}/auth` },
      })
      if (error) throw error
      setSuccess('Bekräftelsemail skickat igen. Kolla inkorg och skräppost.')
      setPendingConfirmationEmail(targetEmail)
    } catch (err: any) {
      setError(err?.message || 'Kunde inte skicka bekräftelsemail igen.')
    } finally {
      setResending(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setPendingConfirmationEmail('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        if (!data.session) {
          setError('Inloggning misslyckades. Kontrollera e-post och lösenord.')
          return
        }
        navigate('/dashboard')
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (!data.session) {
          setPendingConfirmationEmail(email)
          setSuccess('Konto skapat. Bekräfta din e-post och logga sedan in. Inget mail? Skicka igen nedan.')
          setMode('login')
          return
        }
        navigate('/bibliotek')
      }
    } catch (err: any) {
      const message = String(err?.message || '')
      if (message.toLowerCase().includes('email not confirmed')) {
        setError('Du behöver bekräfta din e-post innan du kan logga in.')
      } else if (message.toLowerCase().includes('invalid login credentials')) {
        setError('Fel e-post eller lösenord.')
      } else {
        setError(message || 'Något gick fel. Försök igen.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="fixed top-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-16">
          <h1 className="serif-headline text-5xl italic tracking-tight text-on-surface mb-3">Contista</h1>
          <p className="text-[11px] uppercase tracking-[0.3em] text-on-surface-variant/60 font-medium">
            Din kreativa arbetsyta
          </p>
        </div>

        {/* Mode tabs */}
        <div className="flex bg-surface-container-high rounded-full p-1 mb-10">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 text-[11px] uppercase tracking-[0.15em] font-semibold rounded-full transition-all ${
              mode === 'login' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Logga in
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2.5 text-[11px] uppercase tracking-[0.15em] font-semibold rounded-full transition-all ${
              mode === 'signup' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Skapa konto
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="label-xs text-on-surface-variant/60 block mb-3">E-post</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field"
              placeholder="din@email.com"
              required
            />
          </div>
          <div>
            <label className="label-xs text-on-surface-variant/60 block mb-3">Lösenord</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-primary text-xs leading-relaxed">{error}</p>
          )}

          {success && (
            <p className="text-accent-green text-xs leading-relaxed">{success}</p>
          )}

          {pendingConfirmationEmail && (
            <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-3 space-y-2">
              <p className="text-[11px] text-on-surface-variant">
                Bekräftelse väntar för <strong>{pendingConfirmationEmail}</strong>. Kolla även skräppost.
              </p>
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resending}
                className="text-xs text-primary underline underline-offset-2 disabled:opacity-50"
              >
                {resending ? 'Skickar...' : 'Skicka bekräftelsemail igen'}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-5 text-sm tracking-[0.1em] uppercase mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
                Laddar...
              </span>
            ) : mode === 'login' ? 'Logga in' : 'Skapa konto'}
          </button>

          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={continueWithoutLogin}
              className="w-full py-3 text-xs text-on-surface-variant/70 hover:text-on-surface transition-colors"
            >
              Fortsätt utan inloggning (endast preview)
            </button>
          )}
        </form>

        <p className="text-center mt-16 text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/40 italic">
          Genomtänkt strategi ger organisk respons.
        </p>
      </div>
    </div>
  )
}
