import Topbar from './Topbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#fafafa] dark:bg-background">
      <Topbar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
