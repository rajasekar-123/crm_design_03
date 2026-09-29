
import './globals.css';
import AppLayout from '../components/layout/AppLayout';

export const metadata = { title: 'CopyCore', description: 'Premium SaaS Business Management' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
