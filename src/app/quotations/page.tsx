"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Trash2, FileText, Send, CheckCircle, Download, FileDown } from 'lucide-react';
import { getLocalData, setLocalData, generateId, initialCustomers } from '@/mock/db';

export default function QuotationsPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isBuilder, setIsBuilder] = useState(false);
  
  // Builder State
  const [customer, setCustomer] = useState('');
  const [items, setItems] = useState([{ id: generateId(), product: '', qty: 1, price: 0, discount: 0 }]);
  const [taxRate, setTaxRate] = useState(10);

  useEffect(() => {
    setQuotes(getLocalData('synergy_quotes', []));
    setCustomers(getLocalData('synergy_customers', initialCustomers));
  }, []);

  const saveQuotes = (data: any) => {
    setQuotes(data);
    setLocalData('synergy_quotes', data);
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price) - item.discount, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const addItem = () => setItems([...items, { id: generateId(), product: '', qty: 1, price: 0, discount: 0 }]);
  
  const updateItem = (id: string, field: string, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  
  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id));
  };

  const saveDraft = () => {
    if (!customer) return alert("Please select a customer");
    const quote = {
      id: generateId(),
      date: new Date().toLocaleDateString(),
      customer,
      items,
      subtotal,
      taxAmount,
      total,
      status: 'Draft'
    };
    saveQuotes([quote, ...quotes]);
    closeBuilder();
  };

  const closeBuilder = () => {
    setIsBuilder(false);
    setCustomer('');
    setItems([{ id: generateId(), product: '', qty: 1, price: 0, discount: 0 }]);
  };

  const updateStatus = (id: string, status: string) => {
    saveQuotes(quotes.map(q => q.id === id ? { ...q, status } : q));
  };

  const handleDownload = () => {
    alert("Mock PDF Download Triggered!");
  };

  if (isBuilder) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quotation Builder</h1>
            <p className="text-muted-foreground mt-1">Create a new detailed quotation.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeBuilder}>Cancel</Button>
            <Button onClick={saveDraft}><FileText className="w-4 h-4 mr-2"/> Save Draft</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Products & Services</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase px-1">
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2">Qty</div>
                  <div className="col-span-2">Unit Price</div>
                  <div className="col-span-2">Discount</div>
                  <div className="col-span-1"></div>
                </div>
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5">
                      <Input value={item.product} onChange={e => updateItem(item.id, 'product', e.target.value)} placeholder="Product Name" />
                    </div>
                    <div className="col-span-2">
                      <Input type="number" min="1" value={item.qty} onChange={e => updateItem(item.id, 'qty', Number(e.target.value))} />
                    </div>
                    <div className="col-span-2">
                      <Input type="number" min="0" value={item.price} onChange={e => updateItem(item.id, 'price', Number(e.target.value))} />
                    </div>
                    <div className="col-span-2">
                      <Input type="number" min="0" value={item.discount} onChange={e => updateItem(item.id, 'discount', Number(e.target.value))} />
                    </div>
                    <div className="col-span-1 text-right">
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive"><Trash2 className="w-4 h-4"/></Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addItem} className="mt-2"><Plus className="w-4 h-4 mr-2"/> Add Line Item</Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Client Details</CardTitle></CardHeader>
              <CardContent>
                <label className="text-xs font-medium text-muted-foreground block mb-2">Select Customer</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                  value={customer} 
                  onChange={e => setCustomer(e.target.value)}
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">Tax Rate (%)</span>
                  <Input type="number" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} className="w-20 h-8 text-right" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax Amount</span>
                  <span className="font-medium">${taxAmount.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg">${total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground mt-1">Manage and generate quotes for clients.</p>
        </div>
        <Button onClick={() => setIsBuilder(true)}><Plus className="w-4 h-4 mr-2" /> New Quotation</Button>
      </div>

      <Card>
        <div className="p-4 border-b flex justify-between items-center bg-muted/20">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input placeholder="Search quotes..." className="pl-9 bg-background" />
          </div>
        </div>
        <div className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Quote ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 font-mono font-medium text-muted-foreground">QT-{quote.id.toUpperCase().substring(0,6)}</td>
                  <td className="px-6 py-4 font-medium">{quote.customer}</td>
                  <td className="px-6 py-4 text-muted-foreground">{quote.date}</td>
                  <td className="px-6 py-4 font-medium">${quote.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                      ${quote.status === 'Draft' ? 'bg-muted text-muted-foreground' : ''}
                      ${quote.status === 'Sent' ? 'bg-blue-500/10 text-blue-600' : ''}
                      ${quote.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' : ''}
                    `}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                    {quote.status === 'Draft' && (
                      <Button variant="ghost" size="sm" onClick={() => updateStatus(quote.id, 'Sent')} className="text-blue-600">Send</Button>
                    )}
                    {quote.status === 'Sent' && (
                      <Button variant="ghost" size="sm" onClick={() => updateStatus(quote.id, 'Approved')} className="text-emerald-600">Approve</Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={handleDownload} title="Download PDF"><FileDown className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {quotes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No quotations found. Create your first quote.
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