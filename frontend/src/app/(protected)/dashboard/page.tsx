'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/app/_components/app-sidebar';
import { CaseList } from './_components/case-list';
import { UserAccountMenu } from './_components/user-account';

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background">
        <AppSidebar />
        <main className="flex-1">
          <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
            <h1 className="text-xl font-semibold text-foreground">Case Management System</h1>
            <UserAccountMenu />
          </div>
          <div className="flex-1 overflow-auto">
            <CaseList />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
