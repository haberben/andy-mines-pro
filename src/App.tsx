import { useState, useMemo, useEffect } from 'react'
import { Candy, Bomb as BombIcon, Coins, Trophy, User as UserIcon, History, Shield, Gift, Volume2, Info, LogOut, Loader2, PlayCircle, Settings, Languages } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameState } from './hooks/useGameState'
import { useAuth } from './hooks/useAuth'
import { ProfileModal } from './components/ProfileModal'
import { AuthModal } from './components/AuthModal'
import { supabase } from './lib/supabase'
import { translations, Language } from './lib/i18n'

function App() {
  const { user, profile, loading: authLoading, updateProfile } = useAuth()
  const [lang, setLang] = useState<Language>('tr')
  const t = translations[lang]

  const {
    balance,
    status,
    tiles,
    minesCount,
    setMinesCount,
    betAmount,
    setBetAmount,
    multiplier,
    startGame,
    revealTile,
    cashout,
    revealedSafeTiles,
    rewardAd
  } = useGameState(user?.id, profile?.balance || 1000, lang)

  const [showProfile, setShowProfile] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [isWatchingAd, setIsWatchingAd] = useState(false)
  const [leaderboard, setLeaderboard] = useState<any[]>([])

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from('game_history')
        .select('win_amount, mines_count, profiles(full_name, email)')
        .order('win_amount', { ascending: false })
        .limit(5)
      
      if (data) setLeaderboard(data)
    }
    fetchLeaderboard()
  }, [status])

  const handleWatchAd = async () => {
    setIsWatchingAd(true)
    setTimeout(async () => {
      await rewardAd(100)
      setIsWatchingAd(false)
      alert(lang === 'tr' ? '100 Candy Coin kazandınız!' : 'You earned 100 Candy Coins!')
    }, 3000)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const handleStartGame = async () => {
    if (balance < betAmount) {
      alert(t.insufficientBalance)
      return
    }
    await startGame()
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-candy-gradient flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-candy-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-candy-gradient text-white flex flex-col font-sans selection:bg-candy-primary/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-candy-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-candy-secondary/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-black/60 backdrop-blur-2xl border-b border-candy-gold/20 p-4 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 180 }}
            className="p-3 bg-gradient-to-br from-candy-gold to-candy-gold-dark rounded-2xl shadow-lg ring-2 ring-candy-gold/30"
          >
            <Candy className="w-7 h-7 text-black" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter leading-none italic uppercase gold-text">
              {t.title}
            </h1>
            <div className="flex items-center gap-1.5 pt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t.serverLive}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <button 
            onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
            className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <Languages className="w-4 h-4 text-candy-gold" />
            {lang === 'tr' ? 'ENGLISH' : 'TÜRKÇE'}
          </button>

          <motion.div 
            key={balance}
            initial={{ scale: 1.2, color: '#FFD700' }}
            animate={{ scale: 1, color: '#FFF' }}
            className="flex items-center gap-3 bg-gradient-to-b from-white/10 to-transparent px-5 py-3 rounded-2xl border border-candy-gold/30 shadow-[inset_0_0_20px_rgba(255,215,0,0.1)]"
          >
            <div className="relative">
              <img src="/images/COIN.png" alt="coin" className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
              <motion.div 
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-candy-gold/40 blur-md rounded-full"
              />
            </div>
            <span className="font-black text-xl tabular-nums tracking-tighter gold-text">{balance.toLocaleString()}</span>
            <button 
              onClick={handleWatchAd}
              disabled={isWatchingAd}
              className="ml-2 p-1.5 bg-candy-gold/20 hover:bg-candy-gold/40 rounded-xl text-candy-gold transition-all disabled:opacity-50"
            >
              {isWatchingAd ? <Loader2 className="w-5 h-5 animate-spin" /> : <Gift className="w-5 h-5" />}
            </button>
          </motion.div>
          
          {user ? (
            <div className="flex items-center gap-3">
               <button 
                onClick={() => setShowProfile(true)}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all active:scale-95 group relative overflow-hidden"
              >
                <UserIcon className="w-6 h-6 text-candy-gold" />
                <div className="absolute inset-0 bg-gold-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button 
                onClick={handleSignOut}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl transition-all"
              >
                <LogOut className="w-6 h-6 text-red-400" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuth(true)}
              className="glass-button !py-3 !px-8 text-xs shadow-xl !from-candy-gold !to-candy-gold-dark !text-black"
            >
              {t.signIn}
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[380px,1fr] gap-6 p-4 sm:p-8">
        {/* Betting Terminal */}
        <aside className="flex flex-col gap-6">
           <div className="glass-card p-8 flex flex-col gap-8 relative overflow-hidden group border-candy-gold/30">
            <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
              <Trophy className="w-40 h-40 text-candy-gold" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{t.betAmount}</label>
                <span className="text-[10px] font-black text-candy-gold px-3 py-1 bg-candy-gold/10 rounded-full border border-candy-gold/20">{t.minBet}</span>
              </div>
              <div className="relative group/input">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  disabled={status === 'playing'}
                  className="w-full bg-black/60 border-2 border-white/10 group-focus-within/input:border-candy-gold transition-all rounded-3xl px-8 py-5 text-3xl font-black focus:outline-none disabled:opacity-50 gold-text"
                  placeholder="0.00"
                />
                <img src="/images/COIN.png" alt="coin" className="absolute right-8 top-1/2 -translate-y-1/2 w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setBetAmount(Math.max(10, Math.floor(betAmount / 2)))}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-xs tracking-widest transition-all border border-white/5"
                >
                  1/2
                </button>
                <button 
                  onClick={() => setBetAmount(betAmount * 2)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-xs tracking-widest transition-all border border-white/5"
                >
                  2X
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{t.minesCount}</label>
                <div className="flex flex-wrap gap-2 justify-end">
                   { [1, 3, 5, 24].map((n) => (
                    <button
                      key={n}
                      onClick={() => setMinesCount(n)}
                      className={`w-11 h-11 rounded-2xl font-black text-sm border-2 transition-all flex items-center justify-center ${minesCount === n ? 'border-candy-gold bg-candy-gold/20 text-candy-gold shadow-[0_0_15px_rgba(255,215,0,0.2)]' : 'border-white/5 bg-white/5 text-gray-500 hover:text-white'}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {status === 'playing' ? (
              <motion.button 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.02 }}
                onClick={cashout}
                disabled={revealedSafeTiles === 0}
                className="glass-button w-full !from-green-600 !to-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)] disabled:opacity-50 py-6 flex flex-col items-center gap-1 border-b-4 border-green-800"
              >
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/80">{t.cashout}</span>
                <span className="text-3xl font-black italic tracking-tighter tabular-nums">{(betAmount * multiplier).toFixed(2)} 💎</span>
              </motion.button>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartGame}
                className="glass-button w-full shadow-[0_0_40px_rgba(255,61,113,0.3)] py-6 text-2xl font-black tracking-tighter italic border-b-4 border-candy-secondary/50"
              >
                {t.betNow}
              </motion.button>
            )}
          </div>

          {/* Ad Reward CTA */}
          <button 
            onClick={handleWatchAd}
            disabled={isWatchingAd}
            className="flex-shrink-0 glass-card p-6 bg-gradient-to-br from-candy-primary/30 to-black/20 border-candy-primary/30 group hover:border-candy-primary/60 transition-all flex items-center gap-4 disabled:opacity-50"
          >
             <div className="p-3 bg-candy-primary rounded-2xl shadow-lg ring-4 ring-candy-primary/20 group-hover:scale-110 transition-transform">
                <PlayCircle className="w-6 h-6 text-white" />
             </div>
             <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-candy-primary">{t.earnBalance}</span>
                <h3 className="font-black text-sm leading-tight italic">{t.watchAd}</h3>
             </div>
          </button>
        </aside>

        {/* Game Board */}
        <div className="flex flex-col gap-6">
           <div className="glass-card p-4 sm:p-10 relative aspect-square max-w-[600px] w-full mx-auto flex items-center justify-center shadow-inner-lg">
             {/* Multiplier Info Overlay */}
            <div className="absolute top-4 left-4 z-10">
              <AnimatePresence mode='wait'>
                {status === 'playing' && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col gap-1"
                  >
                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Multiplier</span>
                    <span className="text-4xl font-black text-candy-primary italic tabular-nums">
                      {multiplier.toFixed(2)}<span className="text-xl">x</span>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="candy-grid grid-cols-5 grid-rows-5 w-full h-full relative z-0 p-4">
               {tiles.length > 0 ? (
                 tiles.map((tile) => (
                   <motion.button
                     key={tile.id}
                     whileHover={!tile.isRevealed && status === 'playing' ? { scale: 1.05, y: -5 } : {}}
                     whileTap={!tile.isRevealed && status === 'playing' ? { scale: 0.9 } : {}}
                     onClick={() => revealTile(tile.id)}
                     disabled={tile.isRevealed || status !== 'playing'}
                     className={`relative rounded-2xl transition-all duration-300 preserve-3d shadow-[0_10px_20px_rgba(0,0,0,0.4)] aspect-square flex items-center justify-center border-b-4 ${
                       tile.isRevealed 
                       ? tile.isMine 
                         ? 'bg-red-500/20 border-red-900 shadow-red-500/20' 
                         : 'bg-gradient-to-br from-green-400 to-green-600 border-green-800 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                       : 'bg-gradient-to-br from-white/10 to-transparent border-white/10 hover:border-candy-gold/50 cursor-pointer'
                     }`}
                   >
                     {!tile.isRevealed && (
                       <div className="w-full h-full p-2 flex items-center justify-center relative group">
                         <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent rounded-xl" />
                         <Candy className="absolute w-6 h-6 text-candy-gold/20 group-hover:text-candy-gold group-hover:rotate-12 transition-all duration-300" />
                       </div>
                     )}
                     {tile.isRevealed && (
                       <motion.div
                         initial={{ scale: 0, rotate: -180, filter: 'brightness(2)' }}
                         animate={{ scale: 1, rotate: 0, filter: 'brightness(1)' }}
                         transition={{ type: 'spring', damping: 12 }}
                         className="w-full h-full flex items-center justify-center p-1"
                       >
                         {tile.isMine ? (
                           <img src="/images/BOMBA.png" alt="mine" className="w-[85%] h-[85%] object-contain drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
                         ) : (
                           <div className="relative w-full h-full flex items-center justify-center">
                             <img src="/images/COIN.png" alt="coin" className="w-[90%] h-[90%] object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]" />
                             <motion.div 
                               animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
                               transition={{ duration: 1 }}
                               className="absolute inset-0 bg-white/40 blur-xl rounded-full"
                             />
                           </div>
                         )}
                       </motion.div>
                     )}
                   </motion.button>
                 ))
               ) : (
                 Array.from({ length: 25 }).map((_, i) => (
                   <div 
                     key={i} 
                     className="bg-white/5 border-2 border-white/5 rounded-2xl aspect-square flex items-center justify-center opacity-40"
                   >
                      <Candy className="w-6 h-6 text-white/5" />
                   </div>
                 ))
               )}
            </div>

            {/* Status Modals */}
            <AnimatePresence>
               {status === 'win' && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.8 }}
                   className="absolute inset-0 z-20 flex items-center justify-center p-8 pointer-events-none"
                 >
                    <div className="glass-card !bg-green-500/20 !border-green-500 p-10 flex flex-col items-center gap-4 text-center backdrop-blur-3xl shadow-[0_0_100px_rgba(34,197,94,0.3)]">
                      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                        <Trophy className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-4xl font-black italic tracking-tighter uppercase">{t.bigWinner}</h2>
                      <div className="text-5xl font-black text-green-400 tabular-nums">
                        {(betAmount * multiplier).toLocaleString()}
                      </div>
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Payout at {multiplier.toFixed(2)}x</span>
                   </div>
                 </motion.div>
               )}
               {status === 'loss' && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.8 }}
                   className="absolute inset-0 z-20 flex items-center justify-center p-8 pointer-events-none"
                 >
                   <div className="glass-card !bg-red-500/20 !border-red-500 p-10 flex flex-col items-center gap-4 text-center backdrop-blur-3xl shadow-[0_0_100px_rgba(239,68,68,0.3)]">
                      <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <BombIcon className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-4xl font-black italic tracking-tighter uppercase">{t.boom}</h2>
                      <p className="text-gray-400 font-bold text-sm">{t.betterLuck}</p>
                      <div className="mt-4 flex gap-4 pointer-events-auto">
                        <button onClick={handleStartGame} className="glass-button !bg-red-500 py-3 px-8 text-sm uppercase">{t.tryAgain}</button>
                      </div>
                   </div>
                 </motion.div>
               )}
            </AnimatePresence>
           </div>

           {/* Leaderboard Section */}
           <div className="glass-card p-6 overflow-hidden relative group">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Trophy className="text-yellow-400 w-5 h-5" />
                  <h3 className="font-black italic tracking-tighter text-lg uppercase leading-none">{t.globalRanking}</h3>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.topWinners}</span>
              </div>
              
              <div className="space-y-2">
                {leaderboard.length > 0 ? leaderboard.map((entry, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black italic ${idx === 0 ? 'bg-yellow-400/20 text-yellow-500' : 'bg-white/10 text-gray-500'}`}>#{idx + 1}</span>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm truncate max-w-[150px]">{entry.profiles?.full_name || entry.profiles?.email?.split('@')[0] || t.guest}</span>
                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{entry.mines_count} {t.mines}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src="/images/COIN.png" alt="coin" className="w-4 h-4" />
                      <span className="font-black text-green-400 tabular-nums">+{entry.win_amount.toLocaleString()}</span>
                    </div>
                  </div>
                )) : (
                   <p className="text-center py-8 text-gray-500 font-bold text-sm">{t.noRecentWins}</p>
                )}
              </div>
           </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showProfile && user && (
          <ProfileModal 
            profile={profile} 
            onClose={() => setShowProfile(false)} 
            onUpdate={updateProfile}
            lang={lang}
          />
        )}
        {showAuth && (
          <AuthModal onClose={() => setShowAuth(false)} lang={lang} />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 bg-black/40 backdrop-blur-md p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-xs font-bold tracking-tight uppercase">{t.encryptedEngine}</span>
              </div>
              <p className="text-[10px] text-gray-500 max-w-sm">{t.rewardsNotice}</p>
           </div>
           <div className="flex items-center gap-8">
              <div className="flex flex-col items-center">
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t.tos}</span>
                 <a href="#" className="text-xs font-bold hover:text-candy-primary transition-colors">TOS</a>
              </div>
              <div className="flex flex-col items-center">
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t.help}</span>
                 <a href="#" className="text-xs font-bold hover:text-candy-primary transition-colors">HELP</a>
              </div>
              <div className="flex flex-col items-center">
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t.verify}</span>
                 <a href="#" className="text-xs font-bold hover:text-candy-primary transition-colors">VERIFY</a>
              </div>
           </div>
        </div>
      </footer>
    </div>
  )
}

export default App
