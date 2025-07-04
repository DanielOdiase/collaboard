'use client';

import { useEffect, useState } from 'react';
import {
  useOthers,
  useUpdateMyPresence,
  useStorage,
  useMutation,
} from '../../liveblocks.config';
import { LiveList } from '@liveblocks/client';
import ProductCard from './ProductCard';
import CollaboratorsBar from './CollaboratorsBar';

interface Product {
  id: string;
  name: string;
  description: string;
  status: 'idea' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function ProductBoard() {
  const products = useStorage((root) => root.products) as LiveList<Product> | null;
  const others = useOthers();
  const updateMyPresence = useUpdateMyPresence();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<{
    name: string;
    description: string;
    status: 'idea' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
  }>({
    name: '',
    description: '',
    status: 'idea',
    priority: 'medium',
  });

  const addProduct = useMutation(({ storage }, product: { name: string; description: string; status: 'idea' | 'in-progress' | 'completed'; priority: 'low' | 'medium' | 'high'; }) => {
    const productsList = storage.get('products');
    if (productsList && productsList.push) {
      const newProductWithId = {
        ...product,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
      };
      productsList.push(newProductWithId);
    }
  }, []);

  useEffect(() => {
    updateMyPresence({ isTyping: false });
  }, [updateMyPresence]);

  useEffect(() => {
    if (products && products.length === 0) {
      const sampleProducts = [
        {
          name: 'Mobile App Redesign',
          description: 'Redesign the mobile app with modern UI/UX principles',
          status: 'idea' as const,
          priority: 'high' as const,
        },
        {
          name: 'User Authentication System',
          description: 'Implement secure user authentication with OAuth',
          status: 'in-progress' as const,
          priority: 'high' as const,
        },
        {
          name: 'Analytics Dashboard',
          description: 'Create a comprehensive analytics dashboard for users',
          status: 'completed' as const,
          priority: 'medium' as const,
        },
      ];

      sampleProducts.forEach(product => {
        addProduct(product);
      });
    }
  }, [products, addProduct]);

  const handleAddProduct = () => {
    if (!newProduct.name.trim() || !newProduct.description.trim()) return;

    addProduct(newProduct);
    setNewProduct({
      name: '',
      description: '',
      status: 'idea',
      priority: 'medium',
    });
    setShowAddForm(false);
  };

  const updateProductStatus = useMutation(({ storage }, productId: string, newStatus: Product['status']) => {
    const productsList = storage.get('products');
    if (productsList) {
      const productIndex = productsList.findIndex((p: Product) => p.id === productId);
      if (productIndex !== -1) {
        const product = productsList.get(productIndex);
        if (product) {
          productsList.set(productIndex, { ...product, status: newStatus });
        }
      }
    }
  }, []);

  if (!products) {
    return <div>Loading products...</div>;
  }

  const groupedProducts = {
    idea: products.filter((p: Product) => p.status === 'idea'),
    'in-progress': products.filter((p: Product) => p.status === 'in-progress'),
    completed: products.filter((p: Product) => p.status === 'completed'),
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Board 🚀</h1>
        <div className="flex items-center gap-4">
          <CollaboratorsBar />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showAddForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Add New Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="p-2 border border-gray-300 rounded"
            />
            <select
              value={newProduct.priority}
              onChange={(e) => setNewProduct({ ...newProduct, priority: e.target.value as Product['priority'] })}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <textarea
            placeholder="Product description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="w-full mt-2 p-2 border border-gray-300 rounded"
            rows={3}
          />
          <div className="mt-3">
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
            >
              Add Product
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ideas Column */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-black">💡 Ideas</h2>
          <div className="space-y-3">
            {groupedProducts.idea.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onStatusChange={updateProductStatus}
              />
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">🔄 In Progress</h2>
          <div className="space-y-3">
            {groupedProducts['in-progress'].map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onStatusChange={updateProductStatus}
              />
            ))}
          </div>
        </div>

        {/* Completed Column */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-700">✅ Completed</h2>
          <div className="space-y-3">
            {groupedProducts.completed.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onStatusChange={updateProductStatus}
              />
            ))}
          </div>
        </div>
      </div>

              <p className="mt-6 text-sm text-blue-600 text-center">
        {others.length} collaborator{others.length !== 1 ? 's' : ''} online
      </p>
    </div>
  );
} 