import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Plus, Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';

interface Product {
    id: number;
    name: string;
    price: string;
    stock_quantity: number;
}

interface CartItem extends Product {
    quantity: number;
    imei?: string;
}

const POS = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const addToCart = (product: Product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (id: number) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const updateQuantity = (id: number, qty: number) => {
        if (qty < 1) return;
        setCart(cart.map(item => item.id === id ? { ...item, quantity: qty } : item));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return toast.error('Cart is empty');
        setLoading(true);

        try {
            const payload = {
                customer_phone: customerPhone,
                customer_name: customerName,
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    unit_price: item.price,
                    total_price: Number(item.price) * item.quantity,
                    imei_number: item.imei
                })),
                subtotal: calculateTotal(),
                tax_amount: 0, // Implement Tax logic later
                discount_amount: 0,
                total_amount: calculateTotal(),
                payment_method: 'cash' // Default for now
            };

            await api.post('/sales', payload);
            toast.success('Sale completed successfully!');
            setCart([]);
            setCustomerName('');
            setCustomerPhone('');
            fetchProducts(); // Refresh stock
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-theme(spacing.24))] gap-4">
            {/* Product List */}
            <div className="flex-1 flex flex-col space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Search products..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
                    {filteredProducts.map(product => (
                        <div key={product.id}
                            onClick={() => addToCart(product)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-blue-500 transition-colors flex flex-col justify-between"
                        >
                            <div>
                                <div className="h-24 w-full bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">No Image</span>
                                </div>
                                <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                                <p className="text-sm text-gray-500">Stock: {product.stock_quantity}</p>
                            </div>
                            <div className="mt-2 text-lg font-bold text-blue-600">₹{product.price}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart Sidebar */}
            <div className="w-96 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold flex items-center">
                        <ShoppingCart className="h-5 w-5 mr-2" /> Current Sale
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-400 py-10">Cart is empty</div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex justify-between items-start border-b border-gray-50 pb-2">
                                <div className="flex-1">
                                    <div className="font-medium text-sm">{item.name}</div>
                                    <div className="text-xs text-gray-500">₹{item.price} x {item.quantity}</div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center border rounded">
                                        <button className="px-2 py-1 text-gray-600 hover:bg-gray-100" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                        <span className="px-2 text-sm">{item.quantity}</span>
                                        <button className="px-2 py-1 text-gray-600 hover:bg-gray-100" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-4">
                    <div className="space-y-2">
                        <Input placeholder="Customer Phone (Optional)" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                        <Input placeholder="Customer Name (Optional)" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                    </div>

                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>

                    <Button className="w-full h-12 text-lg" onClick={handleCheckout} isLoading={loading}>
                        <CreditCard className="mr-2 h-5 w-5" /> Checkout
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default POS;
