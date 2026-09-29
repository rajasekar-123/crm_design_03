const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src');
const appDir = path.join(srcDir, 'app');
const componentsDir = path.join(srcDir, 'components');
const uiDir = path.join(componentsDir, 'ui');
const layoutDir = path.join(componentsDir, 'layout');
const mockDir = path.join(srcDir, 'mock');
const servicesDir = path.join(srcDir, 'services');

const dirs = [
  srcDir, appDir, componentsDir, uiDir, layoutDir, mockDir, servicesDir, path.join(srcDir, 'lib'),
  path.join(appDir, 'dashboard'),
  path.join(appDir, 'crm'), path.join(appDir, 'crm', 'customers'), path.join(appDir, 'crm', 'contacts'),
  path.join(appDir, 'leads'), path.join(appDir, 'sales'), path.join(appDir, 'sales', 'opportunities'),
  path.join(appDir, 'quotations'), path.join(appDir, 'orders'),
  path.join(appDir, 'inventory'), path.join(appDir, 'inventory', 'products'), path.join(appDir, 'inventory', 'assets'), path.join(appDir, 'inventory', 'warehouses'), path.join(appDir, 'inventory', 'stock-movements'),
  path.join(appDir, 'service'), path.join(appDir, 'service', 'tickets'), path.join(appDir, 'service', 'technicians'), path.join(appDir, 'service', 'calendar'),
  path.join(appDir, 'rental'), path.join(appDir, 'rental', 'assets'), path.join(appDir, 'rental', 'contracts'), path.join(appDir, 'rental', 'calendar'), path.join(appDir, 'rental', 'returns'),
  path.join(appDir, 'amc'), path.join(appDir, 'amc', 'contracts'), path.join(appDir, 'amc', 'plans'), path.join(appDir, 'amc', 'schedules'), path.join(appDir, 'amc', 'renewals'),
  path.join(appDir, 'invoices'), path.join(appDir, 'payments'),
  path.join(appDir, 'reports'), path.join(appDir, 'reports', 'sales'), path.join(appDir, 'reports', 'service'), path.join(appDir, 'reports', 'rental'), path.join(appDir, 'reports', 'amc'), path.join(appDir, 'reports', 'finance'),
  path.join(appDir, 'ai-copilot'),
  path.join(appDir, 'settings'), path.join(appDir, 'settings', 'profile'), path.join(appDir, 'settings', 'company'), path.join(appDir, 'settings', 'users'), path.join(appDir, 'settings', 'roles'), path.join(appDir, 'settings', 'notifications'), path.join(appDir, 'settings', 'appearance')
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Write globals.css
fs.writeFileSync(path.join(appDir, 'globals.css'), `@import "tailwindcss";
@theme {
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 10% 3.9%;
    --radius: 0.75rem;
  }
}
@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground font-sans antialiased; }
}
`);

// Mock DB
fs.writeFileSync(path.join(mockDir, 'db.ts'), `
export const generateId = () => Math.random().toString(36).substr(2, 9);

export const initialCustomers = [
  { id: '1', name: "Acme Corp", email: "contact@acme.com", phone: "+1 555-0101", status: "Active", revenue: "$50k" },
  { id: '2', name: "Globex Inc", email: "info@globex.com", phone: "+1 555-0102", status: "Inactive", revenue: "$12k" },
  { id: '3', name: "Stark Industries", email: "tony@stark.com", phone: "+1 555-0103", status: "Active", revenue: "$1.2M" },
];

export const initialLeads = [
  { id: '1', title: "Enterprise SaaS Upgrade", company: "Stark Industries", value: 50000, stage: "New" },
  { id: '2', title: "Cloud Migration", company: "Wayne Enterprises", value: 120000, stage: "Negotiation" },
  { id: '3', title: "Security Audit", company: "Oscorp", value: 15000, stage: "Qualified" },
];

export function getLocalData(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
}

export function setLocalData(key, data) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
`);

// utils
fs.writeFileSync(path.join(srcDir, 'lib', 'utils.ts'), `
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
`);

// UI Components
fs.writeFileSync(path.join(uiDir, 'card.tsx'), `
import * as React from "react"
import { cn } from "@/lib/utils"
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)} {...props} />
))
Card.displayName = "Card"
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"
export { Card, CardHeader, CardTitle, CardContent }
`);

fs.writeFileSync(path.join(uiDir, 'button.tsx'), `
import * as React from "react"
import { cn } from "@/lib/utils"
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default'|'outline'|'ghost'|'destructive', size?: 'default'|'sm'|'lg'|'icon' }>(({ className, variant = "default", size = "default", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variant === 'default' && "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        variant === 'outline' && "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        variant === 'ghost' && "hover:bg-accent hover:text-accent-foreground",
        variant === 'destructive' && "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        size === 'default' && "h-9 px-4 py-2",
        size === 'sm' && "h-8 rounded-md px-3 text-xs",
        size === 'lg' && "h-10 rounded-md px-8",
        size === 'icon' && "h-9 w-9",
        className
      )}
      {...props}
    />
  )
})
Button.displayName = "Button"
export { Button }
`);

fs.writeFileSync(path.join(uiDir, 'input.tsx'), `
import * as React from "react"
import { cn } from "@/lib/utils"
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"
export { Input }
`);

// Layouts
fs.writeFileSync(path.join(layoutDir, 'Sidebar.tsx'), `
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Briefcase, FileText, ShoppingCart, Package, Wrench, CalendarClock, ShieldCheck, Receipt, CreditCard, BarChart, Bot, Settings } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const items = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'CRM', icon: Users, href: '/crm' },
    { name: 'Leads', icon: Briefcase, href: '/leads' },
    { name: 'Sales', icon: BarChart, href: '/sales' },
    { name: 'Quotations', icon: FileText, href: '/quotations' },
    { name: 'Orders', icon: ShoppingCart, href: '/orders' },
    { name: 'Inventory', icon: Package, href: '/inventory' },
    { name: 'Service', icon: Wrench, href: '/service' },
    { name: 'Rental', icon: CalendarClock, href: '/rental' },
    { name: 'AMC', icon: ShieldCheck, href: '/amc' },
    { name: 'Invoices', icon: Receipt, href: '/invoices' },
    { name: 'Payments', icon: CreditCard, href: '/payments' },
    { name: 'Reports', icon: BarChart, href: '/reports' },
    { name: 'AI Copilot', icon: Bot, href: '/ai-copilot' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <div className="w-64 border-r bg-card h-screen flex flex-col shadow-sm z-10">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">S</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight">Synergy Biz</h1>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.name} href={item.href} className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
              isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}>
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  );
}
`);

fs.writeFileSync(path.join(layoutDir, 'Topbar.tsx'), `
"use client";
import { Search, Bell, Command, Settings } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2 w-[400px] border border-border focus-within:ring-1 focus-within:ring-primary transition-all">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input type="text" placeholder="Global search..." className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground" />
        <div className="flex items-center gap-1">
          <kbd className="inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"><Command className="w-3 h-3"/>K</kbd>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-accent rounded-full transition-colors relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-background"></span>
        </button>
        <div className="h-8 w-px bg-border mx-2"></div>
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
`);

fs.writeFileSync(path.join(layoutDir, 'AppLayout.tsx'), `
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa] dark:bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
`);

fs.writeFileSync(path.join(appDir, 'layout.tsx'), `
import './globals.css';
import AppLayout from '../components/layout/AppLayout';

export const metadata = { title: 'Synergy Biz', description: 'Premium SaaS Business Management' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
`);

fs.writeFileSync(path.join(appDir, 'page.tsx'), `
import { redirect } from 'next/navigation';
export default function Home() { redirect('/dashboard'); }
`);

// Generic page generation for the rest
const routes = [
  'leads', 'sales', 'sales/opportunities',
  'quotations', 'orders',
  'inventory', 'inventory/products', 'inventory/assets', 'inventory/warehouses', 'inventory/stock-movements',
  'service', 'service/tickets', 'service/technicians', 'service/calendar',
  'rental', 'rental/assets', 'rental/contracts', 'rental/calendar', 'rental/returns',
  'amc', 'amc/contracts', 'amc/plans', 'amc/schedules', 'amc/renewals',
  'invoices', 'payments',
  'reports', 'reports/sales', 'reports/service', 'reports/rental', 'reports/amc', 'reports/finance',
  'settings', 'settings/profile', 'settings/company', 'settings/users', 'settings/roles', 'settings/notifications', 'settings/appearance'
];

routes.forEach(route => {
  const pagePath = path.join(appDir, ...route.split('/'), 'page.tsx');
  if(fs.existsSync(pagePath)) return; // Don't overwrite if we created a specific one
  
  const title = route.split('/').pop().replace(/-/g, ' ');
  let content = `
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Page() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight capitalize">${title}</h1>
        <p className="text-muted-foreground mt-1">Manage your ${title} effectively.</p>
      </div>
      
      <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-xl bg-muted/10">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <h3 className="text-lg font-semibold">${title} Workspace</h3>
        <p className="text-muted-foreground text-sm mt-2 max-w-md">
          This module is part of the robust Synergy Biz platform. Features will include data grids, advanced filtering, and detailed analytics.
        </p>
      </div>
    </div>
  );
}
  `;
  fs.writeFileSync(pagePath, content);
});

console.log('Successfully generated the basic structure!');
