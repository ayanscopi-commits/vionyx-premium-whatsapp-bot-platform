import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import backend from "~backend/client";

interface PurchaseBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const packages = [
  { type: "Starter", groups: 1, days: 7, price: 70 },
  { type: "Basic", groups: 3, days: 30, price: 900 },
  { type: "Pro", groups: 5, days: 30, price: 1500 },
  { type: "Premium", groups: 10, days: 30, price: 3000 },
];

export default function PurchaseBotModal({ isOpen, onClose, onSuccess }: PurchaseBotModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(packages[0]);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await backend.bot.purchase({
        userId: user.id,
        name,
        type: selectedPackage.type,
        groupsCount: selectedPackage.groups,
        days: selectedPackage.days,
      });

      toast({
        title: "Bot berhasil dibeli!",
        description: `Bot ${name} telah aktif`,
      });

      onSuccess();
      onClose();
      setName("");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Pembelian gagal",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-black/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 z-50 shadow-2xl shadow-cyan-500/20"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Beli Bot Baru</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handlePurchase} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200">
                  Nama Bot
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Contoh: Bot Bisnisku"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-black/50 border-cyan-500/30 focus:border-cyan-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-200">Pilih Paket</Label>
                <div className="grid grid-cols-2 gap-3">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.type}
                      type="button"
                      onClick={() => setSelectedPackage(pkg)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedPackage.type === pkg.type
                          ? "border-cyan-500 bg-cyan-500/20 shadow-lg shadow-cyan-500/30"
                          : "border-cyan-500/20 bg-black/40 hover:border-cyan-500/50"
                      }`}
                    >
                      <div className="text-white font-semibold mb-1">{pkg.type}</div>
                      <div className="text-sm text-gray-400 mb-2">
                        {pkg.groups} Grup • {pkg.days} Hari
                      </div>
                      <div className="text-cyan-400 font-bold">{pkg.price} Koin</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Total Harga:</span>
                  <span className="text-2xl font-bold text-cyan-400">
                    {selectedPackage.price} Koin
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {selectedPackage.groups} grup • {selectedPackage.days} hari
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-6 rounded-lg shadow-lg shadow-cyan-500/30 transition-all duration-300"
              >
                {loading ? (
                  "Memproses..."
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Beli Sekarang
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
