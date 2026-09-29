
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Page() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight capitalize">technicians</h1>
        <p className="text-muted-foreground mt-1">Manage your technicians effectively.</p>
      </div>
      
      <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-xl bg-muted/10">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <h3 className="text-lg font-semibold">technicians Workspace</h3>
        <p className="text-muted-foreground text-sm mt-2 max-w-md">
          This module is part of the robust Synergy Biz platform. Features will include data grids, advanced filtering, and detailed analytics.
        </p>
      </div>
    </div>
  );
}
  