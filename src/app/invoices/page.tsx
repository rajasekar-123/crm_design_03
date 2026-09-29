"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Receipt, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { getLocalData, setLocalData, generateId, initialCustomers } from '@/mock/db';

const initialInvoices = [
  { id: 'INV-001', customer: 'Acme Corp', amount: 4500, date: '2024-04-10', dueDate: '2024-05-10', status: 'Paid' },
  { id: 'INV-002', customer: 'Stark Industries', amount: 12500, date: '2024-05-01', dueDate: '2024-05-15', status: 'Overdue' },
  { id: 'INV-003', customer: 'Wayne Enterprises', amount: 3200, date: '2024-05-12', dueDate: '2024-06-12', status: 'Pending' },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState('All');
  
  const [formData, setFormData] = useState({ customer: '', amount: 0, date: '', dueDate: '' });

  useEffect(() => {
    setInvoices(getLocalData('synergy_invoices', initialInvoices));
    setCustomers(getLocalData('synergy_customers', initialCustomers));
  }, []);

  const saveInvoices = (data: any[]) => {
    setInvoices(data);
    setLocalData('synergy_invoices', data);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer || !formData.amount || !formData.dueDate) return;
    saveInvoices([{ ...formData, id: `INV-${generateId().toUpperCase().substring(0,4)}`, status: 'Pending' }, ...invoices]);
    setIsAdding(false);
    setFormData({ customer: '', amount: 0, date: '', dueDate: '' });
  };

  const recordPayment = (id: string) => {
    saveInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-600';
      case 'Paid': return 'bg-emerald-500/10 text-emerald-600';
      case 'Overdue': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredInvoices = filter === 'All' ? invoices : invoices.filter(i => i.status === filter);

  const totalOutstanding = invoices.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage receivables and record payments.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}><Plus className="w-4 h-4 mr-2" /> Create Invoice</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl"><Receipt className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Outstanding</p>
              <h4 className="text-2xl font-bold">${totalOutstanding.toLocaleString()}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 text-destructive rounded-xl"><Clock className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Overdue</p>
              <h4 className="text-2xl font-bold">${totalOverdue.toLocaleString()}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl"><CheckCircle className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Paid This Month</p>
              <h4 className="text-2xl font-bold">$4,500</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {isAdding && (
        <Card className="border-primary/50 shadow-md">
          <CardHeader><CardTitle>Draft Invoice</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-medium">Customer</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})}>
                  <option value="">Select Customer...</option>
                  {customers.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Amount ($)</label>
                <Input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Issue Date</label>
                <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Due Date</label>
                <Input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
              </div>
              <div className="col-span-5 flex justify-end gap-2 mt-2">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit">Issue Invoice</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <div className="p-4 border-b flex justify-between items-center bg-muted/20">
          <div className="flex gap-2">
            {['All', 'Pending', 'Overdue', 'Paid'].map(f => (
              <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)}>{f}</Button>
            ))}
          </div>
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input placeholder="Search invoices..." className="pl-9 h-9 bg-background" />
          </div>
        </div>
        <div className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Issue Date</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 font-mono font-medium text-muted-foreground">{inv.id}</td>
                  <td className="px-6 py-4 font-medium">{inv.customer}</td>
                  <td className="px-6 py-4 text-muted-foreground">{inv.date}</td>
                  <td className="px-6 py-4 text-muted-foreground">{inv.dueDate}</td>
                  <td className="px-6 py-4 font-medium">${inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {inv.status !== 'Paid' && (
                      <Button variant="outline" size="sm" onClick={() => recordPayment(inv.id)} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">Record Payment</Button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}