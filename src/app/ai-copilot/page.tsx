"use client";
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, User, Sparkles } from 'lucide-react';

export default function AICopilotPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm your CopyCore AI Copilot. I can help you analyze your business data, find insights, and automate tasks. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      let reply = "I analyzed your request. Based on the current mock data, everything looks operational.";
      if (userMsg.toLowerCase().includes('amc') && userMsg.toLowerCase().includes('expire')) {
        reply = "You have 3 AMC contracts expiring this month:\n1. Wayne Enterprises - HVAC (Expires in 5 days)\n2. Stark Industries - Server Rack (Expires in 12 days)\n3. Oscorp - Elevators (Expires in 28 days)";
      } else if (userMsg.toLowerCase().includes('sales')) {
        reply = "This month's sales are at $124,500, which is up 12% compared to last month. Your top performing lead is 'Enterprise SaaS Upgrade' for Stark Industries.";
      }
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    }, 800);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary"><Bot className="w-6 h-6" /></div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Copilot</h1>
          <p className="text-muted-foreground text-sm">Your intelligent business assistant.</p>
        </div>
      </div>
      
      <Card className="flex-1 flex flex-col overflow-hidden shadow-sm border-primary/20">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'ai' && <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-primary" /></div>}
              <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted/50 border border-border rounded-tl-sm'}`}>
                {msg.text.split('\n').map((line, idx) => (
                  <p key={idx} className={idx > 0 ? "mt-2" : ""}>{line}</p>
                ))}
              </div>
              {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0"><User className="w-4 h-4 text-muted-foreground" /></div>}
            </div>
          ))}
        </CardContent>
        <div className="p-4 border-t bg-card">
          <div className="flex gap-2 mb-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setInput("Which AMC contracts expire this month?")} className="text-xs h-7 rounded-full"><Sparkles className="w-3 h-3 mr-1 text-primary"/> AMC expiring this month?</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setInput("Show this month's sales.")} className="text-xs h-7 rounded-full"><Sparkles className="w-3 h-3 mr-1 text-primary"/> This month's sales</Button>
          </div>
          <form onSubmit={handleSend} className="relative">
            <Input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Ask Copilot anything about your business..." 
              className="pr-12 py-6 rounded-xl bg-muted/50 border-border focus-visible:ring-primary/50 text-base"
            />
            <Button type="submit" size="icon" className="absolute right-2 top-2 h-8 w-8 rounded-lg bg-primary hover:bg-primary/90">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
