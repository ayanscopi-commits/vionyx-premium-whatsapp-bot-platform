import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import backend from "~backend/client";
import type { Bot } from "~backend/bot/list_bots";

interface BotTableProps {
  bots: Bot[];
  onUpdate: () => void;
}

export default function BotTable({ bots, onUpdate }: BotTableProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingBot, setLoadingBot] = useState<number | null>(null);

  const handleExtend = async (botId: number) => {
    if (!user) return;
    setLoadingBot(botId);

    try {
      await backend.bot.extendBot({
        botId,
        userId: user.id,
        days: 7,
      });

      toast({
        title: "Bot berhasil diperpanjang!",
        description: "Masa aktif bot telah diperpanjang 7 hari",
      });

      onUpdate();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Perpanjangan gagal",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setLoadingBot(null);
    }
  };

  const handleDeactivate = async (botId: number) => {
    if (!user) return;
    setLoadingBot(botId);

    try {
      await backend.bot.deactivateBot({
        botId,
        userId: user.id,
      });

      toast({
        title: "Bot berhasil dinonaktifkan",
      });

      onUpdate();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Deaktivasi gagal",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setLoadingBot(null);
    }
  };

  if (bots.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">Anda belum memiliki bot aktif</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-cyan-500/20">
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Nama</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Tipe</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Grup</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Kadaluarsa</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {bots.map((bot, index) => {
            const isExpired = new Date(bot.expiresAt) < new Date();
            return (
              <motion.tr
                key={bot.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors"
              >
                <td className="py-3 px-4 text-white">{bot.name}</td>
                <td className="py-3 px-4 text-gray-300">{bot.type}</td>
                <td className="py-3 px-4 text-gray-300">{bot.groupsCount}</td>
                <td className="py-3 px-4">
                  <span className={isExpired ? "text-red-400" : "text-gray-300"}>
                    {new Date(bot.expiresAt).toLocaleDateString("id-ID")}
                  </span>
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
                      onClick={() => handleExtend(bot.id)}
                      disabled={loadingBot === bot.id || bot.status === "inactive"}
                      className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeactivate(bot.id)}
                      disabled={loadingBot === bot.id || bot.status === "inactive"}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
