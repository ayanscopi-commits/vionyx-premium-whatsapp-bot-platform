import { useState } from "react";
import { motion } from "framer-motion";
import { Coins, CreditCard, Smartphone } from "lucide-react";
import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import backend from "~backend/client";
import { useNavigate } from "react-router-dom";

const packages = [
  { amount: 10, price: "Rp 10.000", popular: false },
  { amount: 50, price: "Rp 50.000", popular: true },
  { amount: 100, price: "Rp 100.000", popular: false },
  { amount: 500, price: "Rp 500.000", popular: false },
];

const methods = [
  { id: "qris", name: "QRIS", icon: Smartphone },
  { id: "transfer", name: "Transfer Bank", icon: CreditCard },
];

export default function TopUp() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(packages[1].amount);
  const [selectedMethod, setSelectedMethod] = useState(methods[0].id);
  const [loading, setLoading] = useState(false);

  const handleTopUp = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await backend.coin.topUp({
        userId: user.id,
        amount: selectedAmount,
        method: selectedMethod,
      });

      toast({
        title: "Top up berhasil!",
        description: `${selectedAmount} koin telah ditambahkan ke akun Anda`,
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Top up gagal",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Header />

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Top Up Koin</h1>
          <p className="text-gray-400">Isi ulang koin untuk membeli bot premium</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Pilih Paket Koin</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {packages.map((pkg) => (
              <Card
                key={pkg.amount}
                onClick={() => setSelectedAmount(pkg.amount)}
                className={`relative p-6 cursor-pointer transition-all duration-300 ${
                  selectedAmount === pkg.amount
                    ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500 shadow-lg shadow-cyan-500/30"
                    : "bg-black/60 border-gray-700 hover:border-cyan-500/50"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Popular
                  </div>
                )}
                <div className="text-center">
                  <Coins className="h-8 w-8 mx-auto mb-2 text-cyan-400" />
                  <div className="text-3xl font-bold text-white mb-1">{pkg.amount}</div>
                  <div className="text-sm text-gray-400">Koin</div>
                  <div className="text-sm text-cyan-400 mt-2">{pkg.price}</div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Metode Pembayaran</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {methods.map((method) => (
              <Card
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-6 cursor-pointer transition-all duration-300 ${
                  selectedMethod === method.id
                    ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500 shadow-lg shadow-cyan-500/30"
                    : "bg-black/60 border-gray-700 hover:border-cyan-500/50"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <method.icon className="h-8 w-8 text-cyan-400" />
                  <span className="text-lg font-semibold text-white">{method.name}</span>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Button
            onClick={handleTopUp}
            disabled={loading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-12 py-6 text-lg rounded-lg shadow-lg shadow-cyan-500/30 transition-all duration-300"
          >
            {loading ? "Memproses..." : `Top Up ${selectedAmount} Koin`}
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
