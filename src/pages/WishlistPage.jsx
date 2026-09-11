import React, { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingBag, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import { getWishlist, toggleWishlist } from '../services/walletWishlistApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCartThunk } from '../features/cart/cartThunk';

export default function WishlistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlistData = async () => {
    try {
      setLoading(true);
      const res = await getWishlist();
      if (res?.success) {
        setWishlist(res.data?.products || []);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/signin?redirect=/wishlist');
    } else {
      fetchWishlistData();
    }
  }, [user]);

  const handleRemove = async (productId) => {
    try {
      const res = await toggleWishlist(productId);
      if (res?.success) {
        setWishlist((prev) => prev.filter((p) => p._id !== productId && p !== productId));
      }
    } catch (err) {
      console.error("Error removing wishlist item:", err);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCartThunk({
      productId: product._id,
      size: 'Standard',
      color: 'Standard',
      quantity: product.minOrderQty || 1,
      product
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-12 flex justify-center items-center bg-gray-50">
        <div className="flex items-center gap-3 text-red-600 font-semibold">
          <RefreshCw className="animate-spin" size={24} />
          Loading Wishlist...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <Heart className="text-red-600 fill-red-600" size={24} /> My Saved SKUs
            </h1>
            <p className="text-gray-500 text-sm mt-1">Keep track of your frequently ordered tech & mobile inventory.</p>
          </div>
          <span className="bg-red-50 text-red-700 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-red-200">
            {wishlist.length} Saved Items
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Your Wishlist is Empty</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto mt-2 mb-6">Explore Bulko's wholesale categories and save high-margin tech accessories for easy restock.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-red-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-red-700 transition"
            >
              Explore Products <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              if (!item || typeof item !== 'object') return null;
              return (
                <div key={item._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group">
                  <div>
                    <div className="relative h-48 bg-gray-100 p-4 flex items-center justify-center">
                      <img
                        src={item.image || item.thumbnail || 'https://via.placeholder.com/200'}
                        alt={item.name}
                        className="max-h-full object-contain group-hover:scale-105 transition duration-300"
                      />
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="absolute top-3 right-3 p-2 bg-white/90 text-gray-400 hover:text-red-600 rounded-full shadow-sm transition"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                      <span className="absolute bottom-3 left-3 bg-zinc-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Layers size={10} /> MOQ: {item.minOrderQty || 5} Pcs
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2">{item.name || item.title}</h3>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-lg font-extrabold text-red-600">₹{item.wholesalePrice || item.price}</span>
                        {item.mrp && <span className="text-xs text-gray-400 line-through">MRP ₹{item.mrp}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full py-2.5 bg-zinc-900 hover:bg-red-600 text-white font-semibold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={14} /> Add to Order
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
