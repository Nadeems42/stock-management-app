import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { toast } from 'react-toastify';

interface Product {
    id: number;
    name: string;
    sku: string;
    price: string;
    stock_quantity: number;
    category_id: number;
    Category?: {
        name: string;
        id: number;
    };
}

interface Category {
    id: number;
    name: string;
}

const Inventory = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    // New Product State
    const [newProduct, setNewProduct] = useState({
        name: '',
        sku: '',
        price: '',
        stock_quantity: '',
        category_id: ''
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/inventory/categories');
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            // Fallback for demo if API fails or is empty
            if (categories.length === 0) {
                // Try fetching from a different endpoint if needed or just log
            }
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            await api.post('/products', {
                ...newProduct,
                price: parseFloat(newProduct.price),
                stock_quantity: parseInt(newProduct.stock_quantity),
                category_id: parseInt(newProduct.category_id)
            });
            toast.success('Product added successfully');
            setShowAddModal(false);
            setNewProduct({ name: '', sku: '', price: '', stock_quantity: '', category_id: '' });
            fetchProducts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add product');
        } finally {
            setSubmitLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
                <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Product
                </Button>
            </div>

            <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border shadow-sm max-w-md">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search products..."
                    className="flex-1 outline-none text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="px-6 py-3">Product Name</th>
                                <th className="px-6 py-3">SKU</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3 text-center">Stock</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading inventory...</td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No products found.</td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-3 text-gray-500">{product.sku || '-'}</td>
                                        <td className="px-6 py-3">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                                                {product.Category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">₹{product.price}</td>
                                        <td className="px-6 py-3 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock_quantity > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {product.stock_quantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button className="p-1 hover:bg-gray-100 rounded text-gray-600">
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button className="p-1 hover:bg-red-50 rounded text-red-500">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-bold">Add New Product</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateProduct} className="p-4 space-y-4">
                            <Input
                                label="Product Name"
                                placeholder="e.g. iPhone 15 Pro"
                                value={newProduct.name}
                                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="SKU (Optional)"
                                    placeholder="e.g. PH-001"
                                    value={newProduct.sku}
                                    onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                                />
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newProduct.category_id}
                                        onChange={e => setNewProduct({ ...newProduct, category_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Price (₹)"
                                    type="number"
                                    step="0.01"
                                    value={newProduct.price}
                                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Stock Quantity"
                                    type="number"
                                    value={newProduct.stock_quantity}
                                    onChange={e => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="pt-2 flex gap-3">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1" isLoading={submitLoading}>
                                    Save Product
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
