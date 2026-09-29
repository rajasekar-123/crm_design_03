
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
