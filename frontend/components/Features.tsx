import { motion } from "framer-motion";
import { Zap, Shield, Headphones, Sparkles, Bot, Settings } from "lucide-react";
import { useInView } from "react-intersection-observer";

const features = [
  {
    icon: Zap,
    title: "Akses Cepat",
    description: "Deploy bot WhatsApp Anda dalam hitungan detik dengan sistem otomatis kami",
  },
  {
    icon: Bot,
    title: "Fitur Lengkap",
    description: "Auto-reply, jadibot, anti-spam, dan 100+ fitur premium lainnya",
  },
  {
    icon: Settings,
    title: "Panel User",
    description: "Dashboard intuitif untuk mengelola semua bot Anda dengan mudah",
  },
  {
    icon: Shield,
    title: "Keamanan Terjamin",
    description: "Enkripsi end-to-end dan backup otomatis untuk melindungi data Anda",
  },
  {
    icon: Sparkles,
    title: "Harga Fleksibel",
    description: "Paket yang dapat disesuaikan dengan kebutuhan bisnis Anda",
  },
  {
    icon: Headphones,
    title: "Support 24/7",
    description: "Tim support kami siap membantu Anda kapan saja",
  },
];

export default function Features() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Kenapa Memilih{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Vionyx?
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Platform terlengkap dengan fitur premium untuk kebutuhan bot WhatsApp Anda
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-8 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20"
            >
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
