import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  color: "cyan" | "blue" | "purple" | "green";
}

const colorClasses = {
  cyan: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400",
  blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
  purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400",
  green: "from-green-500/20 to-green-600/20 border-green-500/30 text-green-400",
};

export default function StatsCard({ icon: Icon, title, value, color }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6 backdrop-blur-sm shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className={`h-8 w-8 ${colorClasses[color].split(" ")[2]}`} />
        <div className="text-3xl font-bold text-white">{value.toLocaleString()}</div>
      </div>
      <div className="text-sm text-gray-300">{title}</div>
    </motion.div>
  );
}
