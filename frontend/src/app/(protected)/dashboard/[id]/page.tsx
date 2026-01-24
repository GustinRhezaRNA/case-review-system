import { useParams } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/app/_components/app-sidebar';
import { CaseDetail } from '../_components/card-detail';

export default function CaseDetailPage() {
    const { id } = useParams<{ id: string }>();

    return (
        <SidebarProvider>
            <div className="flex w-full min-h-screen bg-background">
                <AppSidebar />
                <main className="flex-1 overflow-hidden">
                    <CaseDetail id={id || ''} />
                </main>
            </div>
        </SidebarProvider>
    );
}
