import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Coins, Bot, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";
import StatsCard from "@/components/StatsCard";
import AdminUserTable from "@/components/AdminUserTable";
import AdminBotTable from "@/components/AdminBotTable";
import AdminTopUpTable from "@/components/AdminTopUpTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import backend from "~backend/client";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => backend.admin.getStatistics(),
  });

  const { data: usersData, refetch: refetchUsers } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => backend.admin.listUsers(),
  });

  const { data: botsData, refetch: refetchBots } = useQuery({
    queryKey: ["adminBots"],
    queryFn: () => backend.admin.listAllBots(),
  });

  const { data: topupsData } = useQuery({
    queryKey: ["adminTopUps"],
    queryFn: () => backend.admin.listAllTopUps(),
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
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Kelola platform Vionyx</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Users}
            title="Total User"
            value={stats?.totalUsers || 0}
            color="cyan"
          />
          <StatsCard
            icon={Coins}
            title="Total Top Up"
            value={stats?.totalTopUps || 0}
            color="blue"
          />
          <StatsCard
            icon={Bot}
            title="Bot Aktif"
            value={stats?.totalActiveBots || 0}
            color="purple"
          />
          <StatsCard
            icon={TrendingUp}
            title="Total Revenue"
            value={stats?.totalRevenue || 0}
            color="green"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6"
        >
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black/60">
              <TabsTrigger value="users">Manajemen User</TabsTrigger>
              <TabsTrigger value="bots">Manajemen Bot</TabsTrigger>
              <TabsTrigger value="topups">Histori Top Up</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <AdminUserTable users={usersData?.users || []} onUpdate={refetchUsers} />
            </TabsContent>

            <TabsContent value="bots" className="mt-6">
              <AdminBotTable bots={botsData?.bots || []} onUpdate={refetchBots} />
            </TabsContent>

            <TabsContent value="topups" className="mt-6">
              <AdminTopUpTable topups={topupsData?.topups || []} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
