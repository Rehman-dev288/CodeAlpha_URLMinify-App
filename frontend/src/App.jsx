import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, TrendingUp, Copy, ExternalLink, Trash2, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Toaster, toast } from "sonner";
import "./App.css";

const BACKEND_URL = "https://bewildered-mickie-rehman-dev-8b2befcb.koyeb.app";
const API = "https://bewildered-mickie-rehman-dev-8b2befcb.koyeb.app/api";

const GlassCard = ({ children, className = "", hover = false }) => (
  <motion.div
    className={`backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-2xl ${hover ? 'hover:bg-white/10 hover:border-white/20' : ''} transition-all duration-300 ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [longUrl, setLongUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState(null);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!longUrl) {
      toast.error("Please enter a URL");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/shorten`, {
        longUrl: longUrl,
        customCode: customCode || null
      });
      setShortenedUrl(response.data);
      toast.success("URL shortened successfully!");
      setLongUrl("");
      setCustomCode("");
    } catch (error) {
    toast.error(error.response?.data?.error || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const shortUrl = shortenedUrl ? `${BACKEND_URL}/${shortenedUrl.shortCode}` : "";

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="noise-overlay"></div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-indigo/20 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-cyan/20 rounded-full blur-[150px] animate-pulse delay-1000"></div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-screen flex flex-col items-center justify-center px-6 md:px-12">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-brand-indigo flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                <Link2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-manrope font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-4">
              URL Minify
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-inter max-w-2xl mx-auto">
              Transform long, complex URLs into sharp, precise links. Track performance with real-time analytics.
            </p>
          </motion.div>

          {/* URL Shortener Form */}
          <GlassCard className="w-full max-w-4xl p-8 md:p-12">
            <form onSubmit={handleShorten} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80 font-inter">Long URL</label>
                <input
                  type="url"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url/that/needs/shortening"
                  className="w-full h-16 text-lg bg-black/50 border-2 border-white/10 focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/20 rounded-xl transition-all placeholder:text-white/20 text-white px-6 outline-none"
                  data-testid="long-url-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/80 font-inter">Custom Short Code (Optional)</label>
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="my-custom-link"
                  className="w-full h-16 text-lg bg-black/50 border-2 border-white/10 focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/20 rounded-xl transition-all placeholder:text-white/20 text-white px-6 outline-none"
                  data-testid="custom-code-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 px-8 rounded-full bg-brand-indigo text-white font-bold shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(99,102,241,0.7)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-manrope"
                data-testid="shorten-button"
              >
                {loading ? "Shortening..." : "Shorten URL"}
              </button>
            </form>

            {/* Result Display */}
            <AnimatePresence>
              {shortenedUrl && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 p-6 bg-brand-indigo/10 border border-brand-indigo/30 rounded-xl"
                  data-testid="shortened-url-result"
                >
                  <p className="text-sm text-white/60 mb-2 font-inter">Your shortened URL:</p>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 text-lg font-mono text-brand-indigo bg-black/30 px-4 py-3 rounded-lg">
                      {shortUrl}
                    </code>
                    <button
                      onClick={() => copyToClipboard(shortUrl)}
                      className="h-12 w-12 rounded-full bg-brand-indigo hover:bg-brand-indigo/80 flex items-center justify-center transition-all"
                      data-testid="copy-url-button"
                    >
                      <Copy className="w-5 h-5 text-white" />
                    </button>
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-12 rounded-full bg-brand-cyan hover:bg-brand-cyan/80 flex items-center justify-center transition-all"
                      data-testid="open-url-button"
                    >
                      <ExternalLink className="w-5 h-5 text-white" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>

          {/* CTA to Dashboard */}
          <motion.button
            onClick={() => navigate("/dashboard")}
            className="mt-8 h-12 px-8 rounded-full bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 font-manrope font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-testid="view-dashboard-button"
          >
            <BarChart3 className="w-5 h-5" />
            View Analytics Dashboard
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/urls`);
      setUrls(response.data);
    } catch (error) {
      toast.error("Failed to fetch URLs");
    } finally {
      setLoading(false);
    }
  };

  const deleteUrl = async (shortCode) => {
    try {
      await axios.delete(`${API}/urls/${shortCode}`);
      toast.success("URL deleted successfully");
      fetchUrls();
    } catch (error) {
      toast.error("Failed to delete URL");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const chartData = urls.map(url => ({
    name: url.shortCode,
    clicks: url.clicks
  })).slice(0, 10);

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
  const totalUrls = urls.length;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="noise-overlay"></div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-indigo/20 rounded-full blur-[150px] animate-pulse"></div>
      
      <div className="relative z-10 px-6 md:px-12 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-manrope font-extrabold tracking-tighter text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground font-inter">Track and manage your shortened URLs</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="h-12 px-6 rounded-full bg-brand-indigo text-white font-bold hover:scale-105 transition-all font-manrope"
            data-testid="back-home-button"
          >
            Create New
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-indigo/20 flex items-center justify-center">
                <Link2 className="w-6 h-6 text-brand-indigo" />
              </div>
              <div>
                <p className="text-sm text-white/60 font-inter">Total URLs</p>
                <p className="text-3xl font-bold text-white font-manrope" data-testid="total-urls-stat">{totalUrls}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-cyan/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-brand-cyan" />
              </div>
              <div>
                <p className="text-sm text-white/60 font-inter">Total Clicks</p>
                <p className="text-3xl font-bold text-white font-manrope" data-testid="total-clicks-stat">{totalClicks}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-pink/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-brand-pink" />
              </div>
              <div>
                <p className="text-sm text-white/60 font-inter">Avg. Clicks/URL</p>
                <p className="text-3xl font-bold text-white font-manrope" data-testid="avg-clicks-stat">
                  {totalUrls > 0 ? (totalClicks / totalUrls).toFixed(1) : 0}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Chart */}
        {urls.length > 0 && (
          <GlassCard className="p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 font-manrope">Click Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(11, 15, 26, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="clicks" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        )}

        {/* URLs List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6 font-manrope">Your Links</h2>
          
          {loading ? (
            <GlassCard className="p-8 text-center">
              <p className="text-white/60 font-inter">Loading...</p>
            </GlassCard>
          ) : urls.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <p className="text-white/60 font-inter">No URLs yet. Create your first shortened URL!</p>
            </GlassCard>
          ) : (
            urls.map((url) => {
              const shortUrl = `${BACKEND_URL}/${url.shortCode}`;
              return (
                <GlassCard key={url.id} className="p-6" hover data-testid={`url-card-${url.shortCode}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <code className="text-brand-indigo font-mono text-lg font-bold" data-testid={`short-code-${url.shortCode}`}>
                          {url.shortCode}
                        </code>
                        <button
                          onClick={() => copyToClipboard(shortUrl)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-all"
                          data-testid={`copy-button-${url.shortCode}`}
                        >
                          <Copy className="w-4 h-4 text-white/60" />
                        </button>
                      </div>
                      <p className="text-white/80 font-inter mb-3 truncate" title={url.longUrl}>
                        {url.longUrl}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-white/50 font-inter">
                        <span data-testid={`clicks-${url.shortCode}`}>
                          <TrendingUp className="w-4 h-4 inline mr-1" />
                          {url.clicks} clicks
                        </span>
                        <span>Created {new Date(url.createdAt).toLocaleDateString()}</span>
                        {url.last_clicked && (
                          <span>Last clicked {new Date(url.last_clicked).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 hover:bg-brand-cyan/20 rounded-lg transition-all"
                        data-testid={`open-button-${url.shortCode}`}
                      >
                        <ExternalLink className="w-5 h-5 text-brand-cyan" />
                      </a>
                      <button
                        onClick={() => deleteUrl(url.shortCode)}
                        className="p-3 hover:bg-red-500/20 rounded-lg transition-all"
                        data-testid={`delete-button-${url.shortCode}`}
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;