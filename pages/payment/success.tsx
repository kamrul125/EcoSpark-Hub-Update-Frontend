import { motion } from "framer-motion";
import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex items-center justify-center px-6 py-20 grow">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-12 text-center bg-white border shadow-2xl rounded-4xl shadow-green-100/50 border-green-50"
        >
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-8 text-5xl text-green-600 bg-green-100 rounded-full animate-bounce">
            ✔
          </div>
          <h1 className="mb-4 text-3xl font-black tracking-tighter text-gray-900">
            Payment <span className="text-green-600">Successful!</span>
          </h1>
          <p className="mb-10 font-bold leading-relaxed text-gray-500">
            অভিনন্দন! আপনি এখন আমাদের <span className="text-green-700">Pro Member</span>। এখন থেকে সব প্রিমিয়াম ব্লুপ্রিন্ট আপনার জন্য উন্মুক্ত।
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/dashboard/member" 
              className="block w-full bg-green-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 shadow-xl shadow-green-100 transition-all active:scale-95"
            >
              Go to Dashboard
            </Link>
            <Link 
              href="/" 
              className="block w-full bg-gray-50 text-gray-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}