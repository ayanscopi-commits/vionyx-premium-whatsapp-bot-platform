import { Instagram, MessageCircle, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-black/60 border-t border-cyan-500/20 mt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              Vionyx
            </h3>
            <p className="text-gray-400">
              Platform terpercaya untuk bot WhatsApp premium dengan fitur lengkap dan support 24/7.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Link Cepat</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Syarat & Ketentuan
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Sosial Media</h4>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30 text-cyan-400 hover:border-cyan-500 transition-all"
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30 text-cyan-400 hover:border-cyan-500 transition-all"
              >
                <MessageCircle className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30 text-cyan-400 hover:border-cyan-500 transition-all"
              >
                <Send className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cyan-500/20 text-center text-gray-400 text-sm">
          © 2024 Vionyx. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
