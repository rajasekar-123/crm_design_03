"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, ShieldCheck, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { getLocalData, setLocalData, generateId, initialCustomers } from '@/mock/db';

const initialAMC = [
  { id: 'AMC-001', customer: 'Acme Corp', asset: 'Industrial Generator 500kVA', startDate: '2023-01-01', endDate: '2023-12-31', type: 'Comprehensive', value: 5000 },
  { id: 'AMC-002', customer: 'Stark Industries', asset: 'Server Rack 42U', startDate: '2024-03-01', endDate: '2025-02-28', type: 'Non-Comprehensive', value: 2500 },
];

export default function AMCPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({ customer: '', asset: '', startDate: '', endDate: '', type: 'Comprehensive', value: 0 });

  useEffect(() => {
    setContracts(getLocalData('synergy_amc_contracts', initialAMC));
    setCustomers(getLocalData('synergy_customers', initialCustomers));
  }, []);

  const saveContracts = (data: any) => {
    setContracts(data);
    setLocalData('synergy_amc_contracts', data);
  };

  const getStatus = (endDateStr: string) => {
    const end = new Date(endDateStr);
    const now = new Date();
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'Expired', color: 'bg-destructive/10 text-destructive' };
    if (diffDays <= 30) return { label: 'Expiring Soon', color: 'bg-amber-500/10 text-amber-600' };
    return { label: 'Active', color: 'bg-emerald-500/10 text-emerald-600' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer || !formData.asset || !formData.endDate) return;
    saveContracts([{ ...formData, id: `AMC-${generateId().toUpperCase().substring(0,4)}` }, ...contracts]);
    setIsAdding(false);
    setFormData({ customer: '', asset: '', startDate: '', endDate: '', type: 'Comprehensive', value: 0 });
  };

  const handleRenew = (id: string) => {
    const updated = contracts.map(c => {
      if (c.id === id) {
        const oldEnd = new Date(c.endDate);
        const newEnd = new Date(oldEnd.setFullYear(oldEnd.getFullYear() + 1));
        return { ...c, endDate: newEnd.toISOString().split('T')[0] };
      }
      return c;
    });
    saveContracts(updated);
    alert('Contract successfully renewed for 1 year!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AMC Contracts</h1>
          <p className="text-muted-foreground mt-1">Manage Annual Maintenance Contracts and renewals.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}><Plus className="w-4 h-4 mr-2" /> New AMC</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl"><ShieldCheck className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Contracts</p>
              <h4 className="text-2xl font-bold">{contracts.filter(c => getStatus(c.endDate).label === 'Active').length}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl"><AlertTriangle className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Expiring Soon (30d)</p>
              <h4 className="text-2xl font-bold">{contracts.filter(c => getStatus(c.endDate).label === 'Expiring Soon').length}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 text-destructive rounded-xl"><Clock className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Expired</p>
              <h4 className="text-2xl font-bold">{contracts.filter(c => getStatus(c.endDate).label === 'Expired').length}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl"><CheckCircle className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Renewed YTD</p>
              <h4 className="text-2xl font-bold">12</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {isAdding && (
        <Card className="border-primary/50 shadow-md">
          <CardHeader><CardTitle>Create AMC Contract</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-6 gap-4 items-end">
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-medium">Customer</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})}>
                  <option value="">Select...</option>
                  {customers.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-medium">Covered Asset / System</label>
                <Input value={formData.asset} onChange={e => setFormData({...formData, asset: e.target.value})} placeholder="e.g. Elevators" />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-medium">Plan Type</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option>Comprehensive</option>
                  <option>Non-Comprehensive</option>
                  <option>Labor Only</option>
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
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-medium">Contract Value ($)</label>
                <Input type="number" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} />
              </div>
              <div className="col-span-6 flex justify-end gap-2 mt-2">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit">Activate Contract</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <div className="p-4 border-b flex justify-between items-center bg-muted/20">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input placeholder="Search contracts..." className="pl-9 bg-background" />
          </div>
        </div>
        <div className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Contract ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Asset / System</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {contracts.map((contract) => {
                const status = getStatus(contract.endDate);
                return (
                  <tr key={contract.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-mono font-medium text-muted-foreground">{contract.id}</td>
                    <td className="px-6 py-4 font-medium">{contract.customer}</td>
                    <td className="px-6 py-4 text-muted-foreground">{contract.asset}</td>
                    <td className="px-6 py-4 text-muted-foreground">{contract.type}</td>
                    <td className="px-6 py-4">{contract.endDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {(status.label === 'Expired' || status.label === 'Expiring Soon') && (
                        <Button variant="outline" size="sm" onClick={() => handleRenew(contract.id)}>Renew</Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}