'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/app/_components/app-sidebar';
import { CaseList } from './_components/case-list';

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background">
        <AppSidebar />
        <main className="flex-1">
          <CaseList />
        </main>
      </div>
    </SidebarProvider>
  );
}
