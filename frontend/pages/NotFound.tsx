import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center px-4"
      >
        <AlertCircle className="h-24 w-24 text-cyan-400 mx-auto mb-6 animate-pulse" />
        <h1 className="text-8xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-white mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. Silakan kembali ke beranda.
        </p>
        <Link to="/">
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-6 rounded-lg shadow-lg shadow-cyan-500/30">
            <Home className="mr-2 h-5 w-5" />
            Kembali ke Beranda
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
