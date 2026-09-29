"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Package, Box, ArrowRightLeft, Edit, Trash2 } from 'lucide-react';
import { getLocalData, setLocalData, generateId } from '@/mock/db';

const initialProducts = [
  { id: 'PRD-101', name: 'Air Filter Pro', category: 'HVAC Parts', stock: 125, price: 45.00 },
  { id: 'PRD-102', name: 'Thermostat V2', category: 'HVAC Parts', stock: 12, price: 120.00 },
  { id: 'PRD-201', name: 'Cat6 Cable (100m)', category: 'IT Supplies', stock: 50, price: 85.00 },
];

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'movements'>('products');
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', category: '', stock: 0, price: 0 });
  const [isAdjusting, setIsAdjusting] = useState<string | null>(null);
  const [adjAmount, setAdjAmount] = useState(0);

  useEffect(() => {
    setProducts(getLocalData('synergy_inventory', initialProducts));
  }, []);

  const saveProducts = (data: any[]) => {
    setProducts(data);
    setLocalData('synergy_inventory', data);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    saveProducts([{ ...formData, id: `PRD-${generateId().toUpperCase().substring(0,4)}` }, ...products]);
    setIsAdding(false);
    setFormData({ name: '', category: '', stock: 0, price: 0 });
  };

  const handleAdjust = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    saveProducts(products.map(p => p.id === id ? { ...p, stock: p.stock + adjAmount } : p));
    setIsAdjusting(null);
    setAdjAmount(0);
  };

  const handleDelete = (id: string) => {
    if(confirm('Delete product?')) {
      saveProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage products, stock levels, and warehouses.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveTab('movements')}><ArrowRightLeft className="w-4 h-4 mr-2"/> Transfers</Button>
          <Button onClick={() => { setActiveTab('products'); setIsAdding(!isAdding); }}><Plus className="w-4 h-4 mr-2" /> Add Product</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><Package className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Products</p>
              <h4 className="text-2xl font-bold">{products.length}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl"><Box className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Low Stock Alerts</p>
              <h4 className="text-2xl font-bold">{products.filter(p => p.stock < 15).length}</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {isAdding && (
        <Card className="border-primary/50 shadow-md">
          <CardHeader><CardTitle>Add New Product</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="flex gap-4 items-end flex-wrap">
              <div className="flex-1 space-y-1 min-w-[200px]">
                <label className="text-xs font-medium">Product Name</label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Copper Pipe" />
              </div>
              <div className="flex-1 space-y-1 min-w-[150px]">
                <label className="text-xs font-medium">Category</label>
                <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Plumbing" />
              </div>
              <div className="w-32 space-y-1">
                <label className="text-xs font-medium">Initial Stock</label>
                <Input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
              </div>
              <div className="w-32 space-y-1">
                <label className="text-xs font-medium">Price ($)</label>
                <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
              </div>
              <Button type="submit">Save Product</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'products' && (
        <Card>
          <div className="p-4 border-b flex justify-between items-center bg-muted/20">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-9 bg-background" />
            </div>
          </div>
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">In Stock</th>
                  <th className="px-6 py-4">Unit Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-mono font-medium text-muted-foreground">{product.id}</td>
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                    <td className="px-6 py-4">
                      {isAdjusting === product.id ? (
                        <form onSubmit={(e) => handleAdjust(e, product.id)} className="flex items-center gap-2">
                          <Input type="number" autoFocus className="w-20 h-7 text-xs" value={adjAmount} onChange={e => setAdjAmount(Number(e.target.value))} />
                          <Button type="submit" size="sm" className="h-7 text-xs">Save</Button>
                          <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setIsAdjusting(null)}>X</Button>
                        </form>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${product.stock < 15 ? 'text-destructive' : ''}`}>{product.stock} units</span>
                          {product.stock < 15 && <span className="bg-destructive/10 text-destructive text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">Low</span>}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      {!isAdjusting && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => setIsAdjusting(product.id)}>Adjust</Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="text-destructive"><Trash2 className="w-4 h-4"/></Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'movements' && (
        <Card>
          <div className="p-12 text-center text-muted-foreground">
            <ArrowRightLeft className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-foreground">Stock Transfers</h3>
            <p className="mt-2">Warehouse transfer tracking will appear here.</p>
          </div>
        </Card>
      )}
    </div>
  );
}