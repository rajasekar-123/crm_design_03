"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Calendar, Wrench, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { getLocalData, setLocalData, generateId, initialCustomers } from '@/mock/db';

const initialTickets = [
  { id: 't1', title: 'HVAC Maintenance', customer: 'Wayne Enterprises', status: 'In Progress', priority: 'High', tech: 'John D.', date: '2024-05-10' },
  { id: 't2', title: 'Server Rack Install', customer: 'Stark Industries', status: 'Open', priority: 'Medium', tech: 'Unassigned', date: '2024-05-12' },
];

const TECHNICIANS = ["John D.", "Sarah M.", "Mike R.", "Alex K."];

export default function ServicePage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({ title: '', customer: '', priority: 'Medium', tech: 'Unassigned', date: '' });

  useEffect(() => {
    setTickets(getLocalData('synergy_tickets', initialTickets));
    setCustomers(getLocalData('synergy_customers', initialCustomers));
  }, []);

  const saveTickets = (data: any) => {
    setTickets(data);
    setLocalData('synergy_tickets', data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.customer) return;
    
    saveTickets([{ ...formData, id: generateId(), status: 'Open' }, ...tickets]);
    setIsAdding(false);
    setFormData({ title: '', customer: '', priority: 'Medium', tech: 'Unassigned', date: '' });
  };

  const updateStatus = (id: string, status: string) => {
    saveTickets(tickets.map(t => t.id === id ? { ...t, status } : t));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Open': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'In Progress': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Desk</h1>
          <p className="text-muted-foreground mt-1">Manage service tickets and technician schedules.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}><Plus className="w-4 h-4 mr-2" /> New Ticket</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><AlertCircle className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Open Tickets</p>
              <h4 className="text-2xl font-bold">{tickets.filter(t => t.status === 'Open').length}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl"><Wrench className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">In Progress</p>
              <h4 className="text-2xl font-bold">{tickets.filter(t => t.status === 'In Progress').length}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl"><CheckCircle2 className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed (30d)</p>
              <h4 className="text-2xl font-bold">{tickets.filter(t => t.status === 'Completed').length}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-600 rounded-xl"><Clock className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Resolution</p>
              <h4 className="text-2xl font-bold">4.2 hrs</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {isAdding && (
        <Card className="border-primary/50 shadow-md">
          <CardHeader><CardTitle>Create Service Ticket</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-medium">Issue Description</label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Preventative Maintenance" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Customer</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})}>
                  <option value="">Select...</option>
                  {customers.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Priority</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Schedule Date</label>
                <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="col-span-5 flex justify-end gap-2 mt-2">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit">Create Ticket</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <div className="p-4 border-b flex justify-between items-center bg-muted/20">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input placeholder="Search tickets..." className="pl-9 bg-background" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Calendar className="w-4 h-4 mr-2"/> Tech Calendar</Button>
          </div>
        </div>
        <div className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Ticket</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Technician</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{ticket.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">#{ticket.id.toUpperCase()}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">{ticket.customer}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${ticket.priority === 'Critical' ? 'text-destructive bg-destructive/10' : 'text-muted-foreground'}`}>{ticket.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                      value={ticket.tech}
                      onChange={e => {
                        const updated = tickets.map(t => t.id === ticket.id ? { ...t, tech: e.target.value } : t);
                        saveTickets(updated);
                      }}
                    >
                      <option>Unassigned</option>
                      {TECHNICIANS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{ticket.date || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {ticket.status === 'Open' && <Button variant="ghost" size="sm" onClick={() => updateStatus(ticket.id, 'In Progress')}>Start</Button>}
                    {ticket.status === 'In Progress' && <Button variant="ghost" size="sm" onClick={() => updateStatus(ticket.id, 'Completed')} className="text-emerald-600">Complete</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}