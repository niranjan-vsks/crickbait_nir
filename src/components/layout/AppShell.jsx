import TopBar from './TopBar';
import BottomNav from './BottomNav';

export default function AppShell({ children }) {
  return (
    <>
      <TopBar />
      <main className="pt-16 pb-20 min-h-screen bg-[#0f131f]">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
