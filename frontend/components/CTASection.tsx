import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "react-intersection-observer";

export default function CTASection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="relative py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-3xl p-12 text-center backdrop-blur-sm shadow-2xl shadow-cyan-500/20"
      >
        <Rocket className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Siap Memulai Perjalanan Anda?
        </h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Daftar sekarang dan dapatkan akses penuh ke platform bot WhatsApp terlengkap. Bangun
          bot profesional Anda hari ini! 🚀
        </p>
        <Link to="/register">
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-10 py-6 text-lg rounded-lg shadow-2xl shadow-cyan-500/30 transition-all duration-300 group">
            Daftar Sekarang
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
