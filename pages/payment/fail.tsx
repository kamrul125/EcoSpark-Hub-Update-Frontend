import { motion } from "framer-motion";
import Link from "next/link";

export default function PaymentFail() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex items-center justify-center px-6 py-20 grow">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-12 text-center bg-white border shadow-2xl rounded-4xl shadow-red-100/30 border-red-50"
        >
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-8 text-5xl text-red-500 bg-red-100 rounded-full">
            ✕
          </div>
          <h1 className="mb-4 text-3xl font-black tracking-tighter text-gray-900">
            Payment <span className="text-red-500">Failed</span>
          </h1>
          <p className="mb-10 font-bold leading-relaxed text-gray-500">
            দুঃখিত! আপনার পেমেন্টটি সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন অথবা আপনার ব্যাংক কার্ড চেক করুন।
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/subscribe" 
              className="block w-full bg-red-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 shadow-xl shadow-red-100 transition-all active:scale-95"
            >
              Try Again
            </Link>
            <Link 
              href="/dashboard/member" 
              className="block w-full bg-gray-50 text-gray-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all"
            >
              Go to Dashboard
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}