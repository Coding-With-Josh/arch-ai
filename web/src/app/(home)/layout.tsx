import '@/styles/globals.css';

import { Navbar } from '@/components/landing/nav';
import { Footer } from '@/components/landing/footer';
import { auth } from '../api/auth/[...nextauth]/auth-options';

async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar session={session} />
      {children}
      <Footer />
    </div>
  );
};

export default HomeLayout;
