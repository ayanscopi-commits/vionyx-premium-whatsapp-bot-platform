import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import type { TopUpHistory } from "~backend/coin/get_history";

interface TopUpHistoryProps {
  topups: TopUpHistory[];
}

export default function TopUpHistory({ topups }: TopUpHistoryProps) {
  if (topups.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">Belum ada riwayat top up</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
      {topups.map((topup, index) => (
        <motion.div
          key={topup.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-black/40 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/40 transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-white font-semibold">{topup.amount} Koin</div>
              <div className="text-sm text-gray-400">{topup.method}</div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                topup.status === "success"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              }`}
            >
              {topup.status === "success" ? "Berhasil" : "Pending"}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {new Date(topup.createdAt).toLocaleString("id-ID")}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
