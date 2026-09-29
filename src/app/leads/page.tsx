"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MoreHorizontal, DollarSign, Building2, Kanban, List, Trash2, Edit } from 'lucide-react';
import { initialLeads, getLocalData, setLocalData, generateId } from '@/mock/db';

const STAGES = ["New", "Contacted", "Qualified", "Quotation", "Negotiation", "Won", "Lost"];

export default function LeadsPage() {
  const [leads, setLeads] = useState<{id:string, title:string, company:string, value:number, stage:string}[]>([]);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', company: '', value: 0, stage: 'New' });

  useEffect(() => {
    setLeads(getLocalData('synergy_leads', initialLeads));
  }, []);

  const saveLeads = (data: any) => {
    setLeads(data);
    setLocalData('synergy_leads', data);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("leadId", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stage: string) => {
    const id = e.dataTransfer.getData("leadId");
    if (!id) return;
    const updated = leads.map(lead => lead.id === id ? { ...lead, stage } : lead);
    saveLeads(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company) return;
    
    if (editingId) {
      saveLeads(leads.map(l => l.id === editingId ? { ...l, ...formData } : l));
    } else {
      saveLeads([...leads, { ...formData, id: generateId() }]);
    }
    closeForm();
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: '', company: '', value: 0, stage: 'New' });
  };

  const editLead = (lead: any) => {
    setFormData({ title: lead.title, company: lead.company, value: lead.value, stage: lead.stage });
    setEditingId(lead.id);
    setIsAdding(true);
  };

  const deleteLead = (id: string) => {
    if(confirm('Delete this lead?')) {
      saveLeads(leads.filter(l => l.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground mt-1">Track and manage your sales pipeline.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-muted p-1 rounded-md flex">
            <button onClick={() => setView('kanban')} className={`p-1.5 rounded-sm text-sm transition-colors ${view === 'kanban' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}><Kanban className="w-4 h-4" /></button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded-sm text-sm transition-colors ${view === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}><List className="w-4 h-4" /></button>
          </div>
          <Button onClick={() => setIsAdding(true)}><Plus className="w-4 h-4 mr-2" /> Add Lead</Button>
        </div>
      </div>

      {isAdding && (
        <Card className="border-primary/50 shadow-md">
          <CardHeader><CardTitle>{editingId ? 'Edit Lead' : 'New Lead'}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
              <div className="flex-1 space-y-1 min-w-[200px]">
                <label className="text-xs font-medium">Opportunity Title</label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Server Upgrade" />
              </div>
              <div className="flex-1 space-y-1 min-w-[200px]">
                <label className="text-xs font-medium">Company</label>
                <Input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Company Name" />
              </div>
              <div className="w-32 space-y-1">
                <label className="text-xs font-medium">Value ($)</label>
                <Input type="number" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} placeholder="0" />
              </div>
              <div className="w-40 space-y-1">
                <label className="text-xs font-medium">Stage</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.stage} 
                  onChange={e => setFormData({...formData, stage: e.target.value})}
                >
                  {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Button type="submit">{editingId ? 'Update' : 'Save'}</Button>
              <Button type="button" variant="ghost" onClick={closeForm}>Cancel</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {view === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-14rem)]">
          {STAGES.map(stage => {
            const stageLeads = leads.filter(l => l.stage === stage);
            const totalValue = stageLeads.reduce((acc, l) => acc + l.value, 0);
            return (
              <div 
                key={stage} 
                className="w-72 shrink-0 flex flex-col bg-muted/30 rounded-xl p-3 border border-border"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    {stage} 
                    <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">{stageLeads.length}</span>
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground">${totalValue.toLocaleString()}</span>
                </div>
                
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {stageLeads.map(lead => (
                    <Card 
                      key={lead.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      className="cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors shadow-sm"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm leading-tight text-foreground">{lead.title}</h4>
                          <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
                            <button onClick={() => editLead(lead)} className="text-muted-foreground hover:text-primary"><Edit className="w-3.5 h-3.5"/></button>
                            <button onClick={() => deleteLead(lead.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5"/></button>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                          <Building2 className="w-3.5 h-3.5" />
                          {lead.company}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                            <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                            {lead.value.toLocaleString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="h-20 border-2 border-dashed rounded-lg flex items-center justify-center text-xs text-muted-foreground/50">
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="p-4 border-b flex justify-between items-center bg-muted/20">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <Input placeholder="Search leads..." className="pl-9 bg-background" />
            </div>
          </div>
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium text-foreground">{lead.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">{lead.company}</td>
                    <td className="px-6 py-4 font-medium">${lead.value.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="bg-muted text-muted-foreground px-2.5 py-1 rounded-full text-xs font-medium">
                        {lead.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => editLead(lead)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteLead(lead.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}