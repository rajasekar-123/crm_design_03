"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, Command, LayoutDashboard, Users, Briefcase, FileText, ShoppingCart, Package, Wrench, CalendarClock, ShieldCheck, Receipt, Bot } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function Topbar() {
  const pathname = usePathname();
  const items = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'CRM', icon: Users, href: '/crm' },
    { name: 'Leads', icon: Briefcase, href: '/leads' },
    { name: 'Quotations', icon: FileText, href: '/quotations' },
    { name: 'Orders', icon: ShoppingCart, href: '/orders' },
    { name: 'Inventory', icon: Package, href: '/inventory' },
    { name: 'Service', icon: Wrench, href: '/service' },
    { name: 'Rental', icon: CalendarClock, href: '/rental' },
    { name: 'AMC', icon: ShieldCheck, href: '/amc' },
    { name: 'Invoices', icon: Receipt, href: '/invoices' },
    { name: 'AI Copilot', icon: Bot, href: '/ai-copilot' },
  ];

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20 flex flex-col shadow-sm">
      <div className="h-16 flex items-center justify-between px-8 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">C</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">CopyCore</h1>
        </div>

        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2 w-[400px] border border-border focus-within:ring-1 focus-within:ring-primary transition-all hidden md:flex">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Global search..." className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground" />
          <div className="flex items-center gap-1">
            <kbd className="inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"><Command className="w-3 h-3"/>K</kbd>
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
      </div>
      
      <div className="px-8 flex items-center gap-1 overflow-x-auto h-12 bg-muted/10 no-scrollbar">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.name} href={item.href} className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
              isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}>
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          )
        })}
      </div>
    </header>
  );
}
