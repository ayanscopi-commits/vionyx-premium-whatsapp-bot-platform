import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg shadow-cyan-500/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <motion.h1
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            >
              Vionyx
            </motion.h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Beranda
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                {!isAdmin && (
                  <Link
                    to="/top-up"
                    className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
                  >
                    Top Up
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
                >
                  Profil
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                    Daftar
                  </Button>
                </Link>
              </>
            )}
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-b border-cyan-500/20"
          >
            <div className="px-4 py-6 space-y-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium"
              >
                Beranda
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to={isAdmin ? "/admin" : "/dashboard"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                  {!isAdmin && (
                    <Link
                      to="/top-up"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium"
                    >
                      Top Up
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium"
                  >
                    Profil
                  </Link>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full border-cyan-500 text-cyan-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500">
                      Daftar
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
