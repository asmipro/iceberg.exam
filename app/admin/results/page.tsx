"use client"

import { useState, useEffect } from "react"
import { BarChart3, Download, Search, User, Calendar, Award, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { exportSubmissionsToExcel } from "@/lib/excel"
import { formatDate } from "@/lib/utils"
import { motion } from "framer-motion"

export default function ResultsPage() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("STUDENT")
  const [selectedLevel, setSelectedLevel] = useState("ALL")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      const res = await fetch("/api/admin/submissions")
      const data = await res.json()
      
      if (data.error) {
        console.error("API Error:", data.error)
        setSubmissions([])
        return
      }
      
      setSubmissions(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Fetch Error:", err)
      setSubmissions([])
    } finally {
      setLoading(false)
    }
  }

  const filteredSubmissions = submissions.filter(s => {
    const searchMatch = (s.firstName?.toLowerCase() || "").includes(search.toLowerCase()) || 
                       (s.lastName?.toLowerCase() || "").includes(search.toLowerCase())
    const levelMatch = selectedLevel === "ALL" || s.level === selectedLevel
    return s.role === filter && searchMatch && levelMatch
  })

  const handleExport = () => {
    exportSubmissionsToExcel(filteredSubmissions, filter, selectedLevel)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-outfit mb-2">Imtihon Natijalari</h1>
          <p className="text-muted-foreground text-lg">Barcha topshirilgan testlar va statistikalar</p>
        </div>
        <button 
          onClick={handleExport}
          className="btn-premium px-8 py-4 font-bold flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Excelga yuklash (.xlsx)
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-900/40 p-4 rounded-lg border border-white/5">
        <div className="flex bg-slate-950 p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => { setFilter("STUDENT"); setSelectedLevel("ALL"); }}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${filter === "STUDENT" ? "bg-primary text-white shadow-sm" : "text-muted-foreground"}`}
          >
            Talabalar
          </button>
          <button 
            onClick={() => { setFilter("TEACHER"); setSelectedLevel("ALL"); }}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${filter === "TEACHER" ? "bg-primary text-white shadow-sm" : "text-muted-foreground"}`}
          >
            O'qituvchilar
          </button>
        </div>

        {filter === "STUDENT" && (
          <select 
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-slate-950 border border-white/5 rounded-lg py-2.5 px-4 text-sm font-bold focus:border-primary outline-none text-white/80"
          >
            <option value="ALL">Barcha Etaplar</option>
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={`${num}-etap`}>{num}-etap</option>
            ))}
          </select>
        )}
        
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Ism yoki familiya bo'yicha qidirish..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-white/5 rounded-lg py-3 pl-12 pr-4 focus:border-primary outline-none transition-all"
          />
        </div>
      </div>

      {/* Results Table/Cards */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-muted-foreground bg-slate-900/40 rounded-lg border border-dashed border-white/10">
          <Search className="w-12 h-12 mb-4 opacity-20" />
          <p className="font-bold">Hech qanday natija topilmadi</p>
          <p className="text-sm opacity-50 mt-1">Siz tanlagan filtr yoki qidiruv bo'yicha ma'lumot yo'q</p>
        </div>
      ) : (
        <div className="bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-white/5">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Talaba</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Test Nomi</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Bosqich</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Sana</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Natija</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {filteredSubmissions.map((sub, idx) => {
                  const percentage = sub.totalQuestions > 0 ? Math.round((sub.score / sub.totalQuestions) * 100) : 0;
                  const statusColor = percentage >= 80 ? 'text-emerald-400' : percentage >= 50 ? 'text-amber-400' : 'text-rose-400';
                  const statusBg = percentage >= 80 ? 'bg-emerald-500/10 border-emerald-500/20' : percentage >= 50 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-rose-500/10 border-rose-500/20';
                  
                  return (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.01 }}
                      key={sub.id}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-black">
                            {sub.firstName[0]}{sub.lastName[0]}
                          </div>
                          <div className="font-bold text-slate-200">
                            {sub.firstName} {sub.lastName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-400">
                          {sub.test?.title || "Noma'lum"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-white/5 border border-white/5 rounded text-[10px] font-black text-slate-500 uppercase tracking-tight">
                          {sub.level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-500 font-medium">
                          {formatDate(sub.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`px-2 py-1 rounded-md border ${statusBg} ${statusColor} text-[10px] font-black`}>
                            {percentage}%
                          </div>
                          <div className="text-[10px] text-slate-600 font-bold">
                            {sub.score} / {sub.totalQuestions}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/admin/results/${sub.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-primary transition-all rounded-lg border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Batafsil</span>
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Mobile footer info */}
          <div className="p-4 bg-slate-950/30 border-t border-white/5 flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
            <span>Jami: {filteredSubmissions.length} natija</span>
            <div className="flex gap-2">
              <button className="p-2 hover:text-primary transition-colors disabled:opacity-20" disabled><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-2 hover:text-primary transition-colors disabled:opacity-20" disabled><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
