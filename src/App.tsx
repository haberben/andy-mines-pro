import { useState, useMemo, useEffect } from 'react'
import { Candy, Bomb as BombIcon, Coins, Trophy, User as UserIcon, History, Shield, Gift, Volume2, Info, LogOut, Loader2, PlayCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameState } from './hooks/useGameState'
import { useAuth } from './hooks/useAuth'
import { ProfileModal } from './components/ProfileModal'
import { AuthModal } from './components/AuthModal'
import { supabase } from './lib/supabase'

function App() {
  const { user, profile, loading: authLoading, updateProfile } = useAuth()
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
  } = useGameState(user?.id, profile?.balance || 0)

  const [showProfile, setShowProfile] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [isWatchingAd, setIsWatchingAd] = useState(false)
  const [leaderboard, setLeaderboard] = useState<any[]>([])

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from('game_history')
        .select('win_amount, profiles(full_name, email)')
        .order('win_amount', { ascending: false })
        .limit(5)
      
      if (data) setLeaderboard(data)
    }
    fetchLeaderboard()
  }, [status])

  const handleWatchAd = async () => {
    setIsWatchingAd(true)
    // Simulate ad watching for 3 seconds
    setTimeout(async () => {
      await rewardAd(100)
      setIsWatchingAd(false)
      alert('You earned 100 Candy Coins! Check your balance.')
    }, 3000)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
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
      <header className="sticky top-0 z-50 w-full glass-card !rounded-none !border-t-0 p-4 flex justify-between items-center shadow-xl backdrop-blur-xl transition-all">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-candy-primary to-candy-secondary rounded-xl shadow-lg shadow-candy-primary/20">
            <Candy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter leading-none italic">
              CANDY <span className="text-candy-primary">MINES</span>
            </h1>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Server Live</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <motion.div 
            key={balance}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-3 bg-black/40 px-4 py-2.5 rounded-2xl border border-white/10 shadow-inner"
          >
            <img src="/images/COIN.png" alt="coin" className="w-5 h-5 object-contain" />
            <span className="font-black text-lg tabular-nums tracking-tight">{(user ? balance : 1000).toLocaleString()}</span>
            <button 
              onClick={handleWatchAd}
              disabled={isWatchingAd}
              className="ml-1 p-1 bg-candy-primary/20 hover:bg-candy-primary/40 rounded-lg text-candy-primary transition-colors disabled:opacity-50"
            >
              {isWatchingAd ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
            </button>
          </motion.div>
          
          {user ? (
            <div className="flex items-center gap-2">
               <button 
                onClick={() => setShowProfile(true)}
                className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all active:scale-90 flex items-center gap-2 group"
              >
                <UserIcon className="w-6 h-6" />
                <span className="hidden sm:inline font-bold text-xs group-hover:text-candy-primary transition-colors">
                  {profile?.full_name?.split(' ')[0] || 'GUEST'}
                </span>
              </button>
              <button 
                onClick={handleSignOut}
                className="p-2 sm:p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl transition-all"
              >
                <LogOut className="w-6 h-6 text-red-400" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuth(true)}
              className="glass-button !py-2 !px-6 text-xs shadow-none border-white/10"
            >
              SIGN IN
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[380px,1fr] gap-6 p-4 sm:p-8">
        {/* Betting Terminal (Already Implemented) */}
        <aside className="flex flex-col gap-4">
           {/* ... (Keep sidebar content from previous step) ... */}
           <div className="glass-card p-6 flex flex-col gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <Settings className="w-20 h-20 rotate-12" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bet Amount</label>
                <span className="text-[10px] font-bold text-candy-primary px-2 py-0.5 bg-candy-primary/10 rounded-full">MIN 10.00</span>
              </div>
              <div className="relative group/input">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  disabled={status === 'playing'}
                  className="w-full bg-black/40 border-2 border-white/5 group-focus-within/input:border-candy-primary/50 transition-all rounded-2xl px-6 py-4 text-2xl font-black focus:outline-none disabled:opacity-50"
                  placeholder="0.00"
                />
                <img src="/images/COIN.png" alt="coin" className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 object-contain opacity-30 group-focus-within/input:opacity-100 transition-opacity" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setBetAmount(Math.max(10, betAmount / 2))}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  1/2
                </button>
                <button 
                  onClick={() => setBetAmount(betAmount * 2)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  2X
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mines Count</label>
                <div className="flex gap-2">
                   { [1, 3, 5, 24].map((n) => (
                    <button
                      key={n}
                      onClick={() => setMinesCount(n)}
                      className={`w-10 h-10 rounded-xl font-black text-sm border-2 transition-all flex items-center justify-center ${minesCount === n ? 'border-candy-primary bg-candy-primary/20 text-white shadow-lg shadow-candy-primary/20' : 'border-white/5 bg-white/5 text-gray-500 hover:text-white'}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {status === 'playing' ? (
              <div className="space-y-4">
                <button 
                  onClick={cashout}
                  disabled={revealedSafeTiles === 0}
                  className="glass-button w-full !bg-green-500/80 hover:!bg-green-500 shadow-xl shadow-green-500/20 disabled:opacity-50 py-5 text-xl flex flex-col items-center gap-1"
                >
                  <span className="text-[10px] uppercase font-black tracking-[0.2em] opacity-80">Cashout</span>
                  <span className="font-black">{(betAmount * multiplier).toFixed(2)}</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={startGame}
                className="glass-button w-full shadow-2xl shadow-candy-primary/20 py-5 text-xl font-black tracking-tight"
              >
                BET NOW
              </button>
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
                <span className="text-[10px] font-black uppercase tracking-widest text-candy-primary">Earn Balance</span>
                <h3 className="font-black text-sm leading-tight italic">Watch Ad for +100 Coins</h3>
             </div>
          </button>
        </aside>

        {/* Game Board (Already Implemented) */}
        <div className="flex flex-col gap-6">
           <div className="glass-card p-4 sm:p-10 relative aspect-square max-w-[600px] w-full mx-auto flex items-center justify-center shadow-inner-lg">
             {/* Copy existing game grid logic here ... */}
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

            <div className="candy-grid grid-cols-5 grid-rows-5 w-full h-full relative z-0">
               {tiles.length > 0 ? (
                 tiles.map((tile) => (
                   <motion.button
                     key={tile.id}
                     whileHover={!tile.isRevealed && status === 'playing' ? { scale: 1.05 } : {}}
                     whileTap={!tile.isRevealed && status === 'playing' ? { scale: 0.95 } : {}}
                     onClick={() => revealTile(tile.id)}
                     disabled={tile.isRevealed || status !== 'playing'}
                     className={`relative rounded-xl overflow-hidden transition-all duration-500 preserve-3d shadow-xl aspect-square flex items-center justify-center border-2 ${
                       tile.isRevealed 
                       ? tile.isMine 
                         ? 'bg-red-500/20 border-red-500 shadow-red-500/20' 
                         : 'bg-green-500/20 border-green-500 shadow-green-500/20'
                       : 'bg-white/5 border-white/10 hover:border-white/30 cursor-pointer active:bg-white/10'
                     }`}
                   >
                     {!tile.isRevealed && (
                       <div className="w-full h-full p-2 flex items-center justify-center relative">
                         <div className="w-full h-full decoration-candy mask-squircle bg-gradient-to-br from-white/10 to-transparent rounded-lg" />
                         <Candy className="absolute w-3 h-3 text-white/5 group-hover:text-white/20" />
                       </div>
                     )}
                     {tile.isRevealed && (
                       <motion.div
                         initial={{ scale: 0, rotate: -45 }}
                         animate={{ scale: 1, rotate: 0 }}
                         className="w-full h-full flex items-center justify-center p-2"
                       >
                         {tile.isMine ? (
                           <img src="/images/BOMBA.png" alt="mine" className="w-[80%] h-[80%] object-contain drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                         ) : (
                           <img src="/images/COIN.png" alt="coin" className="w-[85%] h-[85%] object-contain drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                         )}
                       </motion.div>
                     )}
                   </motion.button>
                 ))
               ) : (
                 Array.from({ length: 25 }).map((_, i) => (
                   <div 
                     key={i} 
                     className="bg-white/5 border-2 border-white/5 rounded-xl aspect-square flex items-center justify-center opacity-40 grayscale"
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
                      <h2 className="text-4xl font-black italic tracking-tighter">BIG WINNER!</h2>
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
                      <h2 className="text-4xl font-black italic tracking-tighter">BOOM!</h2>
                      <p className="text-gray-400 font-bold text-sm">Better luck next time, chef.</p>
                      <div className="mt-4 flex gap-4 pointer-events-auto">
                        <button onClick={startGame} className="glass-button !bg-red-500 py-3 px-8 text-sm uppercase">Try Again</button>
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
                  <h3 className="font-black italic tracking-tighter text-lg uppercase leading-none">Global Ranking</h3>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TOP WINNERS</span>
              </div>
              
              <div className="space-y-2">
                {leaderboard.length > 0 ? leaderboard.map((entry, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black italic ${idx === 0 ? 'bg-yellow-400/20 text-yellow-500' : 'bg-white/10 text-gray-500'}`}>#{idx + 1}</span>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm truncate max-w-[150px]">{entry.profiles?.full_name || entry.profiles?.email?.split('@')[0] || 'Unknown'}</span>
                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{entry.mines_count} MINES</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src="/images/COIN.png" alt="coin" className="w-4 h-4" />
                      <span className="font-black text-green-400 tabular-nums">+{entry.win_amount.toLocaleString()}</span>
                    </div>
                  </div>
                )) : (
                   <p className="text-center py-8 text-gray-500 font-bold text-sm">No recent wins. Be the first!</p>
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
          />
        )}
        {showAuth && (
          <AuthModal onClose={() => setShowAuth(false)} />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 bg-black/40 backdrop-blur-md p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-xs font-bold tracking-tight">ENCRYPTED GAME ENGINE • PROVABLY FAIR</span>
              </div>
              <p className="text-[10px] text-gray-500 max-w-sm">Physical rewards (Ad Soyad/Address) are processed monthly for top ranking players. Ensure your profile is up to date.</p>
           </div>
           <div className="flex items-center gap-8">
              <div className="flex flex-col items-center">
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Legal</span>
                 <a href="#" className="text-xs font-bold hover:text-candy-primary transition-colors">TOS</a>
              </div>
              <div className="flex flex-col items-center">
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Support</span>
                 <a href="#" className="text-xs font-bold hover:text-candy-primary transition-colors">HELP</a>
              </div>
              <div className="flex flex-col items-center">
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fairness</span>
                 <a href="#" className="text-xs font-bold hover:text-candy-primary transition-colors">VERIFY</a>
              </div>
           </div>
        </div>
      </footer>
    </div>
  )
}

export default App
