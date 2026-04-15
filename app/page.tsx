"use client"

import Link from "next/link"
import { GraduationCap, Users, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function RoleSelectionPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl"
      >
        <div className="flex justify-center mb-16 px-4">
          <img src="/Frame 341.png" alt="ICE Logo" className="h-40 w-auto hidden md:block drop-shadow-[0_0_30px_rgba(30,58,138,0.5)]" />
          <img src="/Frame 344.png" alt="ICE Logo" className="h-24 w-auto block md:hidden drop-shadow-2xl" />
        </div>
        <p className="text-muted-foreground text-lg mb-12 max-w-md mx-auto">
          Test tizimiga xush kelibsiz. Iltimos, davom etish uchun o'z rolingizni tanlang.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* O'qituvchi Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/login?role=teacher" className="group">
            <div className="glass-dark p-8 rounded-3xl h-full flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:scale-[1.02]">
              <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-12">
                <GraduationCap className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold font-outfit mb-2">O'qituvchi</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Maxsus tayyorlangan testlarni ishlash va natijalarni yuborish
              </p>
              <div className="flex items-center text-primary font-semibold text-sm">
                Kirish <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* O'quvchi Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/login?role=student" className="group">
            <div className="glass-dark p-8 rounded-3xl h-full flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-accent/10 group-hover:border-accent/30 group-hover:scale-[1.02]">
              <div className="w-20 h-20 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:-rotate-12">
                <Users className="w-10 h-10 text-accent" />
              </div>
              <h2 className="text-2xl font-bold font-outfit mb-2">O'quvchi</h2>
              <p className="text-muted-foreground text-sm mb-6">
                O'z etapingizga mos testni tanlang va bilimingizni sinab ko'ring
              </p>
              <div className="flex items-center text-accent font-semibold text-sm">
                Kirish <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-20"
      >
        <Link href="/admin/login" className="text-muted-foreground hover:text-white transition-colors text-xs uppercase tracking-widest font-bold">
          Admin Paneli
        </Link>
      </motion.div>
    </div>
  )
}
