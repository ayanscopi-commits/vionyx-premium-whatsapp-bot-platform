import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Save } from "lucide-react";
import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import backend from "~backend/client";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => backend.user.getProfile({ userId: user!.id }),
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await backend.user.updateProfile({
        userId: user.id,
        name: name || undefined,
        email: email || undefined,
        password: password || undefined,
      });

      toast({
        title: "Profil berhasil diperbarui!",
        description: "Informasi akun Anda telah diupdate",
      });

      setPassword("");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Update gagal",
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

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Profil Saya</h1>
          <p className="text-gray-400">Kelola informasi akun Anda</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8"
        >
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">
                Nama Lengkap
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-black/50 border-cyan-500/30 focus:border-cyan-500 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-black/50 border-cyan-500/30 focus:border-cyan-500 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">
                Password Baru (Opsional)
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kosongkan jika tidak ingin mengubah"
                  className="pl-10 bg-black/50 border-cyan-500/30 focus:border-cyan-500 text-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-6 rounded-lg shadow-lg shadow-cyan-500/30 transition-all duration-300"
            >
              {loading ? (
                "Menyimpan..."
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Role</div>
                <div className="text-white font-semibold capitalize">{profile?.role}</div>
              </div>
              <div>
                <div className="text-gray-400">Saldo Koin</div>
                <div className="text-cyan-400 font-semibold">{profile?.coins} Koin</div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-400">Bergabung Sejak</div>
                <div className="text-white font-semibold">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("id-ID")
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
