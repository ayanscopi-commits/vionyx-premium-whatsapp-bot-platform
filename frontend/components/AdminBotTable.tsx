import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, XCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import type { AdminBot } from "~backend/admin/list_all_bots";

interface AdminBotTableProps {
  bots: AdminBot[];
  onUpdate: () => void;
}

export default function AdminBotTable({ bots, onUpdate }: AdminBotTableProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<number | null>(null);

  const handleManageBot = async (botId: number, action: string) => {
    setLoading(botId);

    try {
      await backend.admin.manageBot({
        botId,
        action,
        days: action === "extend" ? 7 : undefined,
      });

      toast({
        title: "Berhasil!",
        description: "Aksi berhasil dilakukan",
      });

      onUpdate();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-cyan-500/20">
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">ID</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">User</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Nama Bot</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Tipe</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Grup</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Kadaluarsa</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {bots.map((bot, index) => (
            <motion.tr
              key={bot.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors"
            >
              <td className="py-3 px-4 text-gray-300">{bot.id}</td>
              <td className="py-3 px-4 text-white">{bot.userName}</td>
              <td className="py-3 px-4 text-gray-300">{bot.name}</td>
              <td className="py-3 px-4 text-gray-300">{bot.type}</td>
              <td className="py-3 px-4 text-gray-300">{bot.groupsCount}</td>
              <td className="py-3 px-4 text-gray-300">
                {new Date(bot.expiresAt).toLocaleDateString("id-ID")}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    bot.status === "active"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {bot.status === "active" ? "Aktif" : "Nonaktif"}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleManageBot(bot.id, "extend")}
                    disabled={loading === bot.id}
                    className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  {bot.status === "active" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleManageBot(bot.id, "deactivate")}
                      disabled={loading === bot.id}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleManageBot(bot.id, "activate")}
                      disabled={loading === bot.id}
                      className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
