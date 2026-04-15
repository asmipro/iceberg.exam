"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Layers, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [level, setLevel] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleStart = async () => {
    if (!firstName || !lastName || (role === "STUDENT" && !level)) {
      setError("Iltimos, barcha maydonlarni to'ldiring!")
      return
    }
    
    setLoading(true)
    const finalLevel = role === "STUDENT" ? level : "Staff"
    const userInfo = { firstName, lastName, role, level: finalLevel }
    sessionStorage.setItem("ice_user", JSON.stringify(userInfo))
    
    // Simulating a small delay for better UX
    setTimeout(() => {
      router.push(`/test?role=${role}&level=${finalLevel}`)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-slate-900/40 p-8 md:p-10 rounded-lg border border-white/5 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="relative z-10 space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <img src="/Frame 344.png" alt="ICE Logo" className="h-12 w-auto" />
            </div>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em] mt-3">Ma'lumotlaringizni kiriting</p>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-red-500/10 border border-red-500/10 p-3 rounded-lg flex items-center text-red-500 text-xs font-bold"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Kimsiz?</label>
              <div className="flex bg-slate-950 p-1 rounded-lg border border-white/5">
                {["STUDENT", "TEACHER"].map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRole(r as any); setError("") }}
                    className={`flex-grow py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${role === r ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-white'}`}
                  >
                    {r === "STUDENT" ? "O'quvchi" : "Ustoz"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 text-left block">Ismdagi harf</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-lg py-3 px-4 focus:border-primary outline-none transition-all text-sm font-medium"
                  placeholder="Ism"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 text-left block">Familiya</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-lg py-3 px-4 focus:border-primary outline-none transition-all text-sm font-medium"
                  placeholder="Familiya"
                />
              </div>
            </div>

            {role === "STUDENT" && (
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Guruh (Etap)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(`${l}-etap`)}
                      className={`py-3 rounded-lg text-[10px] font-black transition-all border ${level === `${l}-etap` ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-950 border-white/5 text-muted-foreground'}`}
                    >
                      {l}-etap
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={handleStart}
              disabled={loading}
              className="w-full btn-premium py-4 text-xs font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Boshlash <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
