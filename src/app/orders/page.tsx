"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, Truck, CheckCircle2, Box } from 'lucide-react';
import { getLocalData, setLocalData } from '@/mock/db';

const initialOrders = [
  { id: 'ORD-5001', customer: 'Acme Corp', items: 12, total: 2400, date: '2024-05-01', status: 'Processing' },
  { id: 'ORD-5002', customer: 'Wayne Enterprises', items: 3, total: 450, date: '2024-05-08', status: 'Pending' },
  { id: 'ORD-5003', customer: 'Stark Industries', items: 45, total: 12500, date: '2024-04-20', status: 'Completed' },
];

const STATUSES = ['Pending', 'Confirmed', 'Processing', 'Completed', 'Cancelled'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    setOrders(getLocalData('synergy_orders', initialOrders));
  }, []);

  const saveOrders = (data: any[]) => {
    setOrders(data);
    setLocalData('synergy_orders', data);
  };

  const updateStatus = (id: string, status: string) => {
    saveOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-600';
      case 'Confirmed': return 'bg-blue-500/10 text-blue-600';
      case 'Processing': return 'bg-purple-500/10 text-purple-600';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-600';
      case 'Cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track customer sales orders.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl"><ShoppingCart className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <h4 className="text-2xl font-bold">{orders.filter(o => o.status === 'Pending').length}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-600 rounded-xl"><Box className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Processing</p>
              <h4 className="text-2xl font-bold">{orders.filter(o => o.status === 'Processing').length}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl"><Truck className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">In Transit</p>
              <h4 className="text-2xl font-bold">0</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl"><CheckCircle2 className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed (MTD)</p>
              <h4 className="text-2xl font-bold">{orders.filter(o => o.status === 'Completed').length}</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b flex justify-between items-center bg-muted/20">
          <div className="flex gap-2">
            {['All', ...STATUSES].map(f => (
              <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)}>{f}</Button>
            ))}
          </div>
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input placeholder="Search orders..." className="pl-9 h-9 bg-background" />
          </div>
        </div>
        <div className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Update Phase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 font-mono font-medium text-muted-foreground">{order.id}</td>
                  <td className="px-6 py-4 font-medium">{order.customer}</td>
                  <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                  <td className="px-6 py-4 text-muted-foreground">{order.items} units</td>
                  <td className="px-6 py-4 font-medium">${order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs w-32"
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No orders match this filter.
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