"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MoreHorizontal, Mail, Phone, Trash2 } from 'lucide-react';
import { initialCustomers, getLocalData, setLocalData, generateId } from '@/mock/db';

export default function CRMPage() {
  const [customers, setCustomers] = useState<{id:string, name:string, email:string, phone:string, status:string, revenue:string}[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', status: 'Active', revenue: '$0' });

  useEffect(() => {
    const data = getLocalData('synergy_customers', initialCustomers);
    setCustomers(data);
  }, []);

  const saveCustomers = (data: any) => {
    setCustomers(data);
    setLocalData('synergy_customers', data);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name) return;
    saveCustomers([...customers, { ...newCustomer, id: generateId() }]);
    setNewCustomer({ name: '', email: '', phone: '', status: 'Active', revenue: '$0' });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if(confirm('Are you sure?')) {
      saveCustomers(customers.filter((c: any) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage your customer relationships and contacts.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}><Plus className="w-4 h-4 mr-2" /> Add Customer</Button>
      </div>

      {isAdding && (
        <Card className="border-primary/50 shadow-md">
          <CardHeader><CardTitle>New Customer</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="flex gap-4 items-end">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-medium">Company Name</label>
                <Input value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} placeholder="e.g. Acme Corp" />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-xs font-medium">Email</label>
                <Input value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} type="email" placeholder="contact@acme.com" />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-xs font-medium">Phone</label>
                <Input value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} placeholder="+1 555-0101" />
              </div>
              <Button type="submit">Save</Button>
              <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <div className="p-4 border-b flex justify-between items-center bg-muted/20">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input placeholder="Search customers..." className="pl-9 bg-background" />
          </div>
          <Button variant="outline" size="sm">Filter</Button>
        </div>
        <div className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4 rounded-tl-lg">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4 text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{customer.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5"/> {customer.email || '-'}</span>
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5"/> {customer.phone || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${customer.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{customer.revenue}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(customer.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No customers found. Create your first customer above.
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
