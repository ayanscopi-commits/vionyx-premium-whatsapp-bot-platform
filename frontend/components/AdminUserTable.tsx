import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import type { AdminUser } from "~backend/admin/list_users";

interface AdminUserTableProps {
  users: AdminUser[];
  onUpdate: () => void;
}

export default function AdminUserTable({ users, onUpdate }: AdminUserTableProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<number | null>(null);
  const [coinInputs, setCoinInputs] = useState<{ [key: number]: number }>({});

  const handleManageUser = async (userId: number, action: string, coins?: number) => {
    setLoading(userId);

    try {
      await backend.admin.manageUser({
        userId,
        action,
        coins,
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
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Nama</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Email</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Koin</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Role</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Kelola Koin</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors"
            >
              <td className="py-3 px-4 text-gray-300">{user.id}</td>
              <td className="py-3 px-4 text-white">{user.name}</td>
              <td className="py-3 px-4 text-gray-300">{user.email}</td>
              <td className="py-3 px-4 text-cyan-400 font-semibold">{user.coins}</td>
              <td className="py-3 px-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  {user.role}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Jumlah"
                    value={coinInputs[user.id] || ""}
                    onChange={(e) =>
                      setCoinInputs({ ...coinInputs, [user.id]: parseInt(e.target.value) || 0 })
                    }
                    className="w-24 bg-black/50 border-cyan-500/30 text-white text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleManageUser(user.id, "add-coins", coinInputs[user.id])}
                    disabled={loading === user.id || !coinInputs[user.id]}
                    className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleManageUser(user.id, "subtract-coins", coinInputs[user.id])
                    }
                    disabled={loading === user.id || !coinInputs[user.id]}
                    className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </td>
              <td className="py-3 px-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleManageUser(user.id, "delete")}
                  disabled={loading === user.id}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
