"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Calendar, Box, Activity, AlertCircle } from 'lucide-react';
import { getLocalData, setLocalData, generateId, initialCustomers } from '@/mock/db';

const initialAssets = [
  { id: 'AST-001', name: 'Industrial Generator 500kVA', category: 'Power', status: 'Available', dailyRate: 150 },
  { id: 'AST-002', name: 'Server Rack 42U', category: 'IT', status: 'Rented', dailyRate: 45 },
  { id: 'AST-003', name: 'Heavy Duty Forklift', category: 'Machinery', status: 'Maintenance', dailyRate: 220 },
];

export default function RentalPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  
  const [isContracting, setIsContracting] = useState(false);
  const [formData, setFormData] = useState({ customer: '', assetId: '', startDate: '', endDate: '' });

  useEffect(() => {
    setAssets(getLocalData('synergy_rental_assets', initialAssets));
    setContracts(getLocalData('synergy_rental_contracts', []));
    setCustomers(getLocalData('synergy_customers', initialCustomers));
  }, []);

  const saveAssets = (data: any) => { setAssets(data); setLocalData('synergy_rental_assets', data); };
  const saveContracts = (data: any) => { setContracts(data); setLocalData('synergy_rental_contracts', data); };

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer || !formData.assetId || !formData.startDate || !formData.endDate) return alert("Please fill all fields.");

    const asset = assets.find(a => a.id === formData.assetId);
    if (!asset || asset.status !== 'Available') return alert("Asset is not available for rental.");

    // Calculate duration and total
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return alert("End date must be after start date.");

    const total = diffDays * asset.dailyRate;

    // Update Asset Status
    saveAssets(assets.map(a => a.id === asset.id ? { ...a, status: 'Rented' } : a));
    
    // Create Contract
    saveContracts([{
      id: `RC-${generateId().toUpperCase().substring(0,5)}`,
      customer: formData.customer,
      assetId: asset.id,
      assetName: asset.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      duration: diffDays,
      total,
      status: 'Active'
    }, ...contracts]);

    setIsContracting(false);
    setFormData({ customer: '', assetId: '', startDate: '', endDate: '' });
  };

  const handleReturn = (contractId: string, assetId: string) => {
    saveContracts(contracts.map(c => c.id === contractId ? { ...c, status: 'Completed' } : c));
    saveAssets(assets.map(a => a.id === assetId ? { ...a, status: 'Inspection' } : a));
  };

  const markAvailable = (assetId: string) => {
    saveAssets(assets.map(a => a.id === assetId ? { ...a, status: 'Available' } : a));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rental Management</h1>
          <p className="text-muted-foreground mt-1">Manage rental assets and active contracts.</p>
        </div>
        <Button onClick={() => setIsContracting(!isContracting)}><Plus className="w-4 h-4 mr-2" /> New Contract</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl"><Box className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Available Assets</p>
              <h4 className="text-2xl font-bold">{assets.filter(a => a.status === 'Available').length}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl"><Activity className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Contracts</p>
              <h4 className="text-2xl font-bold">{contracts.filter(c => c.status === 'Active').length}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl"><AlertCircle className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Needs Inspection</p>
              <h4 className="text-2xl font-bold">{assets.filter(a => a.status === 'Inspection').length}</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {isContracting && (
        <Card className="border-primary/50 shadow-md">
          <CardHeader><CardTitle>Create Rental Contract</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreateContract} className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-medium">Customer</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})}>
                  <option value="">Select Customer...</option>
                  {customers.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1 col-span-3">
                <label className="text-xs font-medium">Asset (Available Only)</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={formData.assetId} onChange={e => setFormData({...formData, assetId: e.target.value})}>
                  <option value="">Select Asset...</option>
                  {assets.filter(a => a.status === 'Available').map(a => <option key={a.id} value={a.id}>{a.name} - ${a.dailyRate}/day</option>)}
                </select>
              </div>
              <div className="space-y-1 col-span-2 md:col-span-1">
                <label className="text-xs font-medium">Start Date</label>
                <Input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
              </div>
              <div className="space-y-1 col-span-2 md:col-span-1">
                <label className="text-xs font-medium">End Date</label>
                <Input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
              </div>
              <div className="col-span-5 md:col-span-3 flex justify-end gap-2 mt-2">
                <Button type="button" variant="ghost" onClick={() => setIsContracting(false)}>Cancel</Button>
                <Button type="submit">Draft Contract</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-lg">Active Contracts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
                <tr>
                  <th className="px-4 py-3">Contract</th>
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">End Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contracts.filter(c => c.status === 'Active').map(contract => (
                  <tr key={contract.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{contract.customer}</div>
                      <div className="text-xs text-muted-foreground">{contract.id}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{contract.assetName}</td>
                    <td className="px-4 py-3">{contract.endDate}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" onClick={() => handleReturn(contract.id, contract.assetId)}>Return</Button>
                    </td>
                  </tr>
                ))}
                {contracts.filter(c => c.status === 'Active').length === 0 && (
                  <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No active rental contracts.</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-lg">Asset Status</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
                <tr>
                  <th className="px-4 py-3">Asset Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {assets.map(asset => (
                  <tr key={asset.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{asset.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{asset.id}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{asset.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium 
                        ${asset.status === 'Available' ? 'bg-emerald-500/10 text-emerald-600' : ''}
                        ${asset.status === 'Rented' ? 'bg-blue-500/10 text-blue-600' : ''}
                        ${asset.status === 'Inspection' ? 'bg-amber-500/10 text-amber-600' : ''}
                        ${asset.status === 'Maintenance' ? 'bg-rose-500/10 text-rose-600' : ''}
                      `}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {(asset.status === 'Inspection' || asset.status === 'Maintenance') && (
                        <Button variant="ghost" size="sm" onClick={() => markAvailable(asset.id)} className="text-emerald-600 text-xs">Ready</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}