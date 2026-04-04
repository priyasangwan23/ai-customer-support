import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Star, Heart, Search, Filter, 
  ArrowRight, Tag, DollarSign, Package,
  ShoppingCart, RefreshCw, AlertCircle, ChevronRight
} from 'lucide-react';

const DUMMY_FALLBACK_DATA = [
  { id: 1, title: "Quantum Core Processor v2", price: 349.99, category: "electronics", image: "https://images.unsplash.com/photo-1591815302525-756a9bcc3425?w=500&q=80", rating: { rate: 4.8, count: 120 } },
  { id: 2, title: "Carbon Fiber Wallet", price: 89.00, category: "men's clothing", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80", rating: { rate: 4.5, count: 85 } },
  { id: 3, title: "Onyx Statement Necklace", price: 1250.00, category: "jewelery", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80", rating: { rate: 4.9, count: 42 } },
  { id: 4, title: "Active-Fit Performance Jacket", price: 120.99, category: "men's clothing", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80", rating: { rate: 4.3, count: 210 } },
  { id: 5, title: "Nebula RGB Gaming Mouse", price: 59.99, category: "electronics", image: "https://images.unsplash.com/photo-1527814732934-766b620c39f1?w=500&q=80", rating: { rate: 4.7, count: 450 } },
  { id: 6, title: "Zenith ANC Headphones", price: 299.00, category: "electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", rating: { rate: 4.9, count: 890 } },
  { id: 7, title: "Titanium Mechanical Keyboard", price: 189.50, category: "electronics", image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&q=80", rating: { rate: 4.6, count: 156 } },
  { id: 8, title: "Sapphire Crystal Chronograph", price: 420.00, category: "jewelery", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80", rating: { rate: 4.8, count: 23 } },
  { id: 9, title: "Merlot Silk Gown", price: 750.00, category: "women's clothing", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&q=80", rating: { rate: 4.9, count: 67 } },
  { id: 10, title: "Midnight Denim Jacket", price: 95.00, category: "men's clothing", image: "https://images.unsplash.com/photo-1576871337622-98d48d82937c?w=500&q=80", rating: { rate: 4.2, count: 110 } },
  { id: 11, title: "Crystal Pendulum Earrings", price: 180.00, category: "jewelery", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80", rating: { rate: 4.7, count: 31 } },
  { id: 12, title: "Aero-Running Trainers", price: 145.00, category: "men's clothing", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", rating: { rate: 4.6, count: 1200 } },
  { id: 13, title: "Retro Canvas Tote", price: 35.00, category: "women's clothing", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80", rating: { rate: 4.4, count: 742 } },
  { id: 14, title: "Polarized Shield Aviators", price: 120.00, category: "men's clothing", image: "https://images.unsplash.com/photo-1511499767390-9ef112346e80?w=500&q=80", rating: { rate: 4.5, count: 56 } },
  { id: 15, title: "Rose Gold Smart Ring", price: 349.00, category: "jewelery", image: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500&q=80", rating: { rate: 4.3, count: 38 } },
  { id: 16, title: "UltraWide 49\" OLED Monitor", price: 1199.99, category: "electronics", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80", rating: { rate: 4.9, count: 211 } },
  { id: 17, title: "Cashmere Turtleneck", price: 210.00, category: "women's clothing", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80", rating: { rate: 4.8, count: 154 } },
  { id: 18, title: "Field Notes Leather Cover", price: 45.00, category: "men's clothing", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=80", rating: { rate: 4.6, count: 88 } },
  { id: 19, title: "Thunderbolt 4 Docking Station", price: 250.00, category: "electronics", image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80", rating: { rate: 4.7, count: 96 } },
  { id: 20, title: "Suede Chelsea Boots", price: 180.00, category: "men's clothing", image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&q=80", rating: { rate: 4.4, count: 184 } }
];

const ProductCard = ({ product, onAddToCart, onToggleFavorite, isFavorite }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -5 }}
    className="group relative flex flex-col rounded-3xl overflow-hidden glass border border-white/5 bg-[#0D1526]/40 hover:bg-[#0D1526]/60 transition-all duration-300"
  >
    {/* Image Container */}
    <div className="relative h-56 w-full overflow-hidden bg-white group-hover:bg-gray-50 transition-colors">
      <img 
        src={product.image} 
        alt={product.title} 
        className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id); }}
          className={`p-2.5 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
            isFavorite 
              ? 'bg-red-500/20 border-red-500/50 text-red-500' 
              : 'bg-black/20 border-white/10 text-white/70 hover:text-white hover:bg-black/40'
          }`}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-wider text-blue-400 backdrop-blur-md">
          {product.category}
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="p-6 flex-1 flex flex-col">
      <div className="flex items-center gap-1 mb-2 text-yellow-500">
        <Star size={12} fill="currentColor" />
        <span className="text-[10px] font-bold text-slate-400">{product.rating.rate} ({product.rating.count})</span>
      </div>
      <h3 className="text-sm font-bold text-white line-clamp-2 mb-3 leading-tight group-hover:text-blue-400 transition-colors">
        {product.title}
      </h3>
      
      <div className="mt-auto flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Unit Price</span>
          <span className="text-lg font-black text-white">${product.price.toFixed(2)}</span>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => onAddToCart(product)}
          className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all border border-blue-400/20"
        >
          <ShoppingCart size={18} />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

const SkeletonCard = () => (
  <div className="h-96 rounded-3xl bg-slate-800/20 border border-white/5 animate-pulse overflow-hidden">
    <div className="h-56 bg-slate-800/40" />
    <div className="p-6 space-y-3">
      <div className="h-2 w-20 bg-slate-800/40 rounded" />
      <div className="h-4 w-full bg-slate-800/40 rounded" />
      <div className="h-4 w-2/3 bg-slate-800/40 rounded" />
      <div className="pt-4 flex justify-between">
        <div className="space-y-2">
          <div className="h-2 w-16 bg-slate-800/30 rounded" />
          <div className="h-6 w-24 bg-slate-800/40 rounded" />
        </div>
        <div className="h-12 w-12 bg-slate-800/40 rounded-2xl" />
      </div>
    </div>
  </div>
);

const StatBadge = ({ title, value, icon: Icon, color }) => (
  <div className="flex-1 min-w-[200px] p-6 rounded-3xl glass border border-white/5 flex items-center gap-5">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-${color}-600/10`} 
      style={{ background: `linear-gradient(135deg, ${color} 0%, transparent 100%)`, border: `1px solid ${color}44` }}>
      <Icon size={24} />
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{title}</span>
      <span className="text-2xl font-black text-white leading-none">{value}</span>
    </div>
  </div>
);

const SidePanel = ({ isOpen, onClose, title, items, onRemove, icon: Icon, type = 'cart' }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
        />
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-full max-w-sm glass-dark border-l border-white/5 z-[101] flex flex-col shadow-2xl"
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Icon size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-tight">{title}</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{items.length} Units Active</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors">
              <RefreshCw size={20} className="rotate-45" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                <Icon size={40} className="mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">No assets found</p>
              </div>
            ) : (
              items.map((item, idx) => (
                <motion.div 
                  layout
                  key={item.id + (type === 'cart' ? '-cart' : '-wish')}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-[#0D1526]/60 border border-white/5 flex items-center gap-4 group"
                >
                  <div className="w-16 h-16 rounded-xl bg-white p-2 flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate mb-1">{item.title}</h4>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">${item.price}</p>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))
            )}
          </div>

          {type === 'cart' && items.length > 0 && (
            <div className="p-6 border-t border-white/5 bg-black/40">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">TOTAL VALUATION</p>
                  <p className="text-2xl font-black text-white leading-none">
                    ${items.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full">SECURE ENCRYPTED</div>
              </div>
              <button className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98]">
                Finalize Acquisition
              </button>
            </div>
          )}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('https://fakestoreapi.com/products');
      if (!res.ok) throw new Error('API connection failed');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.warn('Marketplace Sync Failed [API Error]: Switching to Local Assets.', err.message);
      setProducts(DUMMY_FALLBACK_DATA);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'all' || p.category === category;
      return matchSearch && matchCat;
    });
  }, [products, search, category]);

  const categories = useMemo(() => {
    return ['all', ...new Set(products.map(p => p.category))];
  }, [products]);

  const stats = useMemo(() => {
    if (products.length === 0) return { total: 0, avg: 0, cats: 0 };
    const avg = products.reduce((acc, curr) => acc + curr.price, 0) / products.length;
    return {
      total: products.length,
      avg: avg.toFixed(2),
      cats: categories.length - 1
    };
  }, [products, categories]);

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addToCart = (product) => {
    setCart(prev => [...prev, { ...product, cartId: Date.now() }]);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Inventory Sync Failed</h2>
        <p className="text-slate-500 max-w-md mb-8">We couldn't connect to the marketplace database.</p>
        <button onClick={fetchProducts} className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-widest">
          <RefreshCw size={14} /> Re-establish Link
        </button>
      </div>
    );
  }

  const wishlistItems = products.filter(p => favorites.has(p.id));

  return (
    <div className="w-full h-full overflow-y-auto px-10 py-10 relative bg-dashboard-main">
      
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-50">
        <div className="relative z-10">
          <h1 className="text-5xl font-black gradient-text tracking-tighter uppercase leading-none mb-3">Marketplace</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Live Inventory Linked</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-[#0D1526]/60 border border-white/5 rounded-2xl px-12 py-3.5 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
          
          {/* Wishlist Icon */}
          <button 
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-1 group"
          >
            <Heart className={`w-6 h-6 transition-all duration-300 ${favorites.size > 0 ? 'text-red-500 fill-red-500' : 'text-white hover:text-red-400'}`} />
            {favorites.size > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-600 text-white text-[8px] font-black flex items-center justify-center rounded-full shadow-lg border border-[#0F172A]">
                {favorites.size}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-1 group"
          >
            <ShoppingBag className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors" />
            {cart.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-lg border-2 border-[#0F172A]"
              >
                {cart.length}
              </motion.span>
            )}
          </button>
        </div>
      </header>

      {/* Stats row */}
      <div className="flex flex-wrap gap-6 mb-12 relative z-10">
        <StatBadge title="Total Inventory" value={stats.total} icon={Package} color="#3B82F6" />
        <StatBadge title="Market Avg Price" value={`$${stats.avg}`} icon={DollarSign} color="#818CF8" />
        <StatBadge title="Revenue Vectors" value={stats.cats} icon={Tag} color="#2DD4BF" />
        <StatBadge title="Favorites Active" value={favorites.size} icon={Heart} color="#F43F5E" />
      </div>

      {/* Filter / Category Bar */}
      <div className="flex items-center gap-4 mb-8 relative z-10 overflow-x-auto pb-2 scrollbar-hide">
        <div className="p-3 rounded-2xl bg-[#0D1526]/60 border border-white/5 text-blue-500">
          <Filter size={18} />
        </div>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
              category === cat 
                ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-600/20' 
                : 'bg-[#0D1526]/40 border-white/5 text-slate-500 hover:text-white hover:border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10 p-1">
        {loading ? (
          [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
        ) : filteredProducts.length > 0 ? (
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart}
                onToggleFavorite={toggleFavorite}
                isFavorite={favorites.has(product.id)}
              />
            ))}
          </AnimatePresence>
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-50">
            <Package size={60} className="mb-4 text-slate-800" />
            <h3 className="text-xl font-bold text-slate-400 uppercase tracking-tighter">No items found matching your filter</h3>
          </div>
        )}
      </div>

      {/* Side Panels */}
      <SidePanel 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        title="Asset Acquisition"
        items={cart}
        onRemove={removeFromCart}
        icon={ShoppingBag}
        type="cart"
      />

      <SidePanel 
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        title="Wishlist Repository"
        items={wishlistItems}
        onRemove={toggleFavorite}
        icon={Heart}
        type="wishlist"
      />

      <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 opacity-30">
        <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-slate-500">Core Marketplace Engine · Sync Active</p>
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600">
          POWERED BY <span className="text-slate-400">FAKESTORE GLOBAL</span>
        </div>
      </footer>

    </div>
  );
};

export default ProductDashboard;
