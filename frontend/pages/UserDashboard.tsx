import { useState } from "react";
import { motion } from "framer-motion";
import { Coins, Bot, History, User } from "lucide-react";
import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";
import StatsCard from "@/components/StatsCard";
import BotTable from "@/components/BotTable";
import TopUpHistory from "@/components/TopUpHistory";
import PurchaseBotModal from "@/components/PurchaseBotModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import backend from "~backend/client";

export default function UserDashboard() {
  const { user } = useAuth();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const { data: balance } = useQuery({
    queryKey: ["balance", user?.id],
    queryFn: () => backend.coin.getBalance({ userId: user!.id }),
    enabled: !!user,
  });

  const { data: botsData, refetch: refetchBots } = useQuery({
    queryKey: ["bots", user?.id],
    queryFn: () => backend.bot.listBots({ userId: user!.id }),
    enabled: !!user,
  });

  const { data: historyData } = useQuery({
    queryKey: ["topupHistory", user?.id],
    queryFn: () => backend.coin.getHistory({ userId: user!.id }),
    enabled: !!user,
  });

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Selamat Datang, {user?.name}!
          </h1>
          <p className="text-gray-400">Kelola bot WhatsApp Anda dengan mudah</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={Coins}
            title="Saldo Koin"
            value={balance?.coins || 0}
            color="cyan"
          />
          <StatsCard
            icon={Bot}
            title="Bot Aktif"
            value={botsData?.bots.filter((b) => b.status === "active").length || 0}
            color="blue"
          />
          <StatsCard
            icon={History}
            title="Total Top Up"
            value={historyData?.topups.length || 0}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Bot Saya</h2>
              <Button
                onClick={() => setIsPurchaseModalOpen(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                Beli Bot
              </Button>
            </div>
            <BotTable bots={botsData?.bots || []} onUpdate={refetchBots} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Histori Top Up</h2>
            <TopUpHistory topups={historyData?.topups || []} />
          </motion.div>
        </div>
      </main>

      <PurchaseBotModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onSuccess={refetchBots}
      />
    </div>
  );
}
