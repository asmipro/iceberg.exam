"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Image as ImageIcon, CheckCircle2, ChevronLeft, Loader2, Clock } from "lucide-react"
import { motion } from "framer-motion"

export default function NewTestPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null)
  
  const [newTest, setNewTest] = useState({
    title: "",
    role: "STUDENT" as "STUDENT" | "TEACHER",
    level: "1-etap",
    timeLimit: 30,
    questions: [
      { text: "", type: "MCQ", imageUrl: "", options: ["", "", "", ""], correctAnswer: "A" }
    ]
  })

  const updateQuestion = (idx: number, data: any) => {
    setNewTest((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === idx ? { ...q, ...data } : q)
    }))
  }

  const addQuestionAt = (idx: number) => {
    const newQuestions = [...newTest.questions]
    newQuestions.splice(idx + 1, 0, { text: "", type: "MCQ", imageUrl: "", options: ["", "", "", ""], correctAnswer: "A" })
    setNewTest({ ...newTest, questions: newQuestions })
  }

  const addQuestionFirst = () => {
    setNewTest({
      ...newTest,
      questions: [{ text: "", type: "MCQ", imageUrl: "", options: ["", "", "", ""], correctAnswer: "A" }, ...newTest.questions]
    })
  }

  const removeQuestion = (idx: number) => {
    if (newTest.questions.length <= 1) return alert("Kamida bitta savol bo'lishi kerak!")
    setNewTest({
      ...newTest,
      questions: newTest.questions.filter((_, i) => i !== idx)
    })
  }

  const handleImageUpload = async (idx: number, file: File) => {
    if (!file) return
    setUploadingIdx(idx)
    
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const base64 = reader.result
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            file: base64, 
            folder: (newTest.title || "ice-exams").trim() 
          }),
        })
        const data = await res.json()
        if (data.url) updateQuestion(idx, { imageUrl: data.url })
      } catch (err) {
        alert("Rasm yuklashda xatolik!")
      } finally {
        setUploadingIdx(null)
      }
    }
  }

  const handleCreateTest = async () => {
    if (!newTest.title) return alert("Sarlavhani kiriting!")
    setLoading(true)
    const submissionData = {
      ...newTest,
      level: newTest.role === "TEACHER" ? "Staff" : newTest.level
    }
    try {
      const res = await fetch("/api/admin/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      })
      if (res.ok) router.push("/admin/tests")
    } catch (err) {
      alert("Xatolik!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-full mx-auto space-y-8 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/50 p-6 rounded-lg border border-white/5">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all border border-white/5">
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-black font-outfit uppercase tracking-tight">E'lon qilish: Yangi Test</h1>
              <p className="text-muted-foreground text-sm">Barcha maydonlarni to'ldiring va saqlash tugmasini bosing</p>
            </div>
          </div>
          <button 
            onClick={handleCreateTest}
            disabled={loading}
            className="btn-premium px-8 py-3.5 font-bold shadow-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
            Testni Saqlash
          </button>
        </div>

        {/* Basic Info Section */}
        <div className="bg-slate-900/40 p-8 rounded-lg border border-white/5 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Test Sarlavhasi</label>
            <input 
              type="text" 
              value={newTest.title}
              onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
              className="w-full bg-slate-950 border border-white/5 rounded-lg py-4 px-6 focus:border-primary outline-none text-xl font-bold placeholder:text-slate-800 transition-all"
              placeholder="Masalan: Unit 5 - Vocabulary Check"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
               <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Auditoriya</label>
               <div className="flex bg-slate-950 p-1 rounded-lg border border-white/5">
                  {["STUDENT", "TEACHER"].map((role) => (
                    <button
                      key={role}
                      onClick={() => setNewTest({ ...newTest, role: role as any })}
                      className={`flex-grow py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${newTest.role === role ? 'bg-primary text-white' : 'text-muted-foreground hover:text-white'}`}
                    >
                      {role === "STUDENT" ? "O'quvchilar" : "Ustozlar"}
                    </button>
                  ))}
               </div>
            </div>
            
            {newTest.role === "STUDENT" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Bosqich (Etap)</label>
                 <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <button
                        key={i}
                        onClick={() => setNewTest({ ...newTest, level: `${i}-etap` })}
                        className={`py-2.5 rounded-lg text-[10px] font-black transition-all border ${newTest.level === `${i}-etap` ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-slate-950 border-white/5 text-muted-foreground'}`}
                      >
                        {i}-etap
                      </button>
                    ))}
                 </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Vaqt Limiti (daqiqada)</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="number" 
                value={newTest.timeLimit}
                onChange={(e) => setNewTest({ ...newTest, timeLimit: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-white/5 rounded-lg py-4 pl-12 pr-6 focus:border-primary outline-none text-xl font-bold transition-all"
                placeholder="30"
              />
            </div>
            <p className="text-[10px] text-muted-foreground italic">Vaqt tugaganda test avtomatik saqlanadi.</p>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-black font-outfit uppercase tracking-widest">Savollar ({newTest.questions.length})</h2>
            <button onClick={addQuestionFirst} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline transition-all">
              + Teppaga savol qo'shish
            </button>
          </div>

          <div className="space-y-4">
            {newTest.questions.map((q, qIdx) => (
              <div key={qIdx} className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900/60 p-6 md:p-8 rounded-lg border border-white/5 space-y-6 relative"
                >
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black border border-primary/20">
                      {qIdx + 1}
                    </div>
                    <button onClick={() => removeQuestion(qIdx)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-8 space-y-4">
                        <textarea 
                          placeholder="Savol matnini bu yerga yozing..."
                          value={q.text}
                          onChange={(e) => updateQuestion(qIdx, { text: e.target.value })}
                          className="w-full h-32 bg-slate-950 border border-white/5 rounded-lg p-5 focus:border-primary outline-none text-base resize-none transition-all"
                        />
                        
                        <div className="flex flex-wrap gap-4 items-center justify-between bg-slate-950 p-4 rounded-lg border border-white/5">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Savol turi:</span>
                            <div className="flex bg-slate-900 p-1 rounded-lg">
                              {["MCQ", "OPEN"].map(type => (
                                <button 
                                  key={type}
                                  onClick={() => updateQuestion(qIdx, { type })}
                                  className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${q.type === type ? "bg-primary text-white" : "text-slate-500 hover:text-white"}`}
                                >
                                  {type === "MCQ" ? "Variantli" : "Ochiq"}
                                </button>
                              ))}
                            </div>
                          </div>

                          {!q.imageUrl ? (
                            <div className="relative">
                              <input type="file" accept="image/*" onChange={(e) => e.target.files && handleImageUpload(qIdx, e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                              <div className="px-4 py-2 bg-white/5 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 border border-white/5 hover:bg-white/10 transition-all">
                                {uploadingIdx === qIdx ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
                                Rasm yuklash
                              </div>
                            </div>
                          ) : (
                             <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 text-green-500 text-[10px] font-black uppercase tracking-widest">
                                <CheckCircle2 className="w-3 h-3" /> Rasm bor
                                <button onClick={() => updateQuestion(qIdx, { imageUrl: "" })} className="ml-2 hover:text-white">&times;</button>
                              </div>
                          )}
                        </div>
                      </div>

                      <div className="lg:col-span-4">
                        {q.imageUrl ? (
                          <div className="relative group aspect-square lg:aspect-auto h-full min-h-[160px] bg-slate-950 rounded-lg overflow-hidden border border-white/5">
                             <img src={q.imageUrl} alt="Savol" className="w-full h-full object-cover opacity-80" />
                          </div>
                        ) : (
                          <div className="h-full min-h-[160px] bg-slate-950 rounded-lg border border-dashed border-white/5 flex flex-col items-center justify-center text-slate-800 text-[10px] font-black uppercase tracking-widest">
                             Rasm yo'q
                          </div>
                        )}
                      </div>
                    </div>

                    {q.type === "MCQ" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {["A", "B", "C", "D"].map((letter, optIdx) => (
                          <div 
                            key={letter}
                            onClick={() => updateQuestion(qIdx, { correctAnswer: letter })}
                            className={`p-1 rounded-lg cursor-pointer transition-all border ${q.correctAnswer === letter ? 'border-green-500 bg-green-500/10' : 'border-white/5 bg-slate-950 hover:bg-slate-900'}`}
                          >
                            <div className="flex items-center gap-4 p-3">
                              <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-black ${q.correctAnswer === letter ? 'bg-green-500 text-white' : 'bg-slate-900 text-slate-500'}`}>
                                {letter}
                              </div>
                              <input 
                                type="text"
                                placeholder={`Variant ${letter}...`}
                                value={q.options[optIdx] || ""}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                  const newOpts = [...q.options]
                                  newOpts[optIdx] = e.target.value
                                  updateQuestion(qIdx, { options: newOpts })
                                }}
                                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-800"
                              />
                              {q.correctAnswer === letter && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
                
                {/* Add Question Button AFTER each question */}
                <div className="flex justify-center -my-2 relative z-10">
                   <button 
                    onClick={() => addQuestionAt(qIdx)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary transition-all group"
                   >
                     <div className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <Plus className="w-3 h-3" />
                     </div>
                     Savol qo'shish
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex justify-end">
          <button 
            onClick={handleCreateTest}
            disabled={loading}
            className="btn-premium px-12 py-5 text-xl font-bold shadow-2xl"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Testni e'lon qilish"}
          </button>
        </div>
      </div>
    </div>
  )
}
