"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Briefcase, Activity } from 'lucide-react';

const data = [
  { name: 'Jan', revenue: 4000, sales: 240 },
  { name: 'Feb', revenue: 3000, sales: 139 },
  { name: 'Mar', revenue: 2000, sales: 980 },
  { name: 'Apr', revenue: 2780, sales: 390 },
  { name: 'May', revenue: 1890, sales: 480 },
  { name: 'Jun', revenue: 2390, sales: 380 },
  { name: 'Jul', revenue: 3490, sales: 430 },
];

export default function DashboardPage() {
  const kpis = [
    { title: "Total Revenue", value: "$2.4M", change: "+12.5%", icon: DollarSign, trend: 'up' },
    { title: "Active Customers", value: "1,245", change: "+4.1%", icon: Users, trend: 'up' },
    { title: "Open Leads", value: "84", change: "-2.5%", icon: Briefcase, trend: 'down' },
    { title: "Service Health", value: "98%", change: "+0.2%", icon: Activity, trend: 'up' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Executive Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your business overview and key metrics.</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="relative overflow-hidden group hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <kpi.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{kpi.value}</div>
              <p className="text-xs mt-2 flex items-center font-medium">
                {kpi.trend === 'up' ? (
                  <span className="text-emerald-500 flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded-md"><ArrowUpRight className="w-3 h-3 mr-1"/>{kpi.change}</span>
                ) : (
                  <span className="text-rose-500 flex items-center bg-rose-500/10 px-1.5 py-0.5 rounded-md"><ArrowDownRight className="w-3 h-3 mr-1"/>{kpi.change}</span>
                )}
                <span className="text-muted-foreground ml-2">vs last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { title: 'New lead qualified', desc: 'Stark Industries SaaS upgrade', time: '10 mins ago', color: 'bg-blue-500' },
                { title: 'Payment received', desc: '$12,500 from Wayne Enterprises', time: '1 hour ago', color: 'bg-emerald-500' },
                { title: 'Service ticket resolved', desc: 'HVAC repair at Site B', time: '3 hours ago', color: 'bg-purple-500' },
                { title: 'AMC contract renewed', desc: 'Globex Inc annual maintenance', time: '5 hours ago', color: 'bg-orange-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-2 h-2 mt-2 rounded-full ${item.color}`} />
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground whitespace-nowrap">{item.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
