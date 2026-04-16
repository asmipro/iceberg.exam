import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-black font-outfit text-primary mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-6">Sahifa topilmadi</h2>
      <p className="text-muted-foreground mb-10 max-w-md mx-auto">
        Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga ko'chirilgan.
      </p>
      <Link 
        href="/" 
        className="btn-premium px-8 py-3 rounded-xl font-bold transition-all"
      >
        Bosh sahifaga qaytish
      </Link>
    </div>
  )
}
