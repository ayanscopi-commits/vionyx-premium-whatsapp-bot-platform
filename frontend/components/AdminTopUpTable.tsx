import { motion } from "framer-motion";
import type { AdminTopUp } from "~backend/admin/list_all_topups";

interface AdminTopUpTableProps {
  topups: AdminTopUp[];
}

export default function AdminTopUpTable({ topups }: AdminTopUpTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-cyan-500/20">
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">ID</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">User</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Jumlah</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Metode</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {topups.map((topup, index) => (
            <motion.tr
              key={topup.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors"
            >
              <td className="py-3 px-4 text-gray-300">{topup.id}</td>
              <td className="py-3 px-4 text-white">{topup.userName}</td>
              <td className="py-3 px-4 text-cyan-400 font-semibold">{topup.amount} Koin</td>
              <td className="py-3 px-4 text-gray-300">{topup.method}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    topup.status === "success"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  }`}
                >
                  {topup.status === "success" ? "Berhasil" : "Pending"}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-300">
                {new Date(topup.createdAt).toLocaleString("id-ID")}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
