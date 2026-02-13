'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
    CheckCircle,
    AlertCircle,
    Eye,
    ChevronDown,
    BarChart3,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getStatusCounts, getUserStats } from '@/api/case';
import { useAuth } from '@/hooks/use-auth';

// Status name mapping from API to display label
const STATUS_DISPLAY_MAP: Record<string, { label: string; icon: typeof AlertCircle }> = {
    'TO_BE_REVIEWED': { label: 'To Review', icon: AlertCircle },
    'REVIEW_SUBMITTED': { label: 'Review Submitted', icon: CheckCircle },
    'OBSERVATION': { label: 'Observation', icon: Eye },
    'COMPLETE': { label: 'Complete', icon: CheckCircle },
};

interface StatusCount {
    status: string;
    count: number;
}

interface StatusCountsResponse {
    total: number;
    byStatus: StatusCount[];
}

export function AppSidebar() {
    const { user } = useAuth();
    const [expandedSections, setExpandedSections] = useState<string[]>(['Progress']);
    const [statusCounts, setStatusCounts] = useState<StatusCountsResponse | null>(null);
    const [assignedCount, setAssignedCount] = useState<number>(0);
    const [userStats, setUserStats] = useState<any>(null);


    useEffect(() => {
        // Fetch global status counts
        getStatusCounts()
            .then((res) => {
                setStatusCounts(res);
            })
            .catch((error) => {
                console.error('Error fetching status counts:', error);
            });

        // Fetch user specific stats if user exists
        if (user?.id) {
            getUserStats(user.id)
                .then((res) => {
                    setUserStats(res.byStatus);
                    setAssignedCount(res.totalAssigned);
                })
                .catch((error) => {
                    console.error('Error fetching user stats:', error);
                });
        }
    }, [user?.id]);

    const toggleSection = (section: string) => {
        setExpandedSections((prev) =>
            prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
        );
    };

    // Build progress items - Use userStats if available, otherwise global defaults
    const progressSource = userStats?.byStatus || statusCounts?.byStatus || [];

    const progressItems = progressSource.map((item: StatusCount) => {
        const displayInfo = STATUS_DISPLAY_MAP[item.status] || { label: item.status, icon: AlertCircle };
        return {
            label: displayInfo.label,
            count: item.count,
            icon: displayInfo.icon,
            statusKey: item.status.toLowerCase().replace(/_/g, '-'),
        };
    });

    const otherItems = [
        { label: 'Assigned', count: assignedCount, icon: BarChart3 },
    ];

    return (
        <Sidebar className="border-r border-border bg-sidebar">
            <SidebarHeader className="border-b border-border px-4 py-4">
                <div>
                    <h1 className="text-xl font-bold text-sidebar-foreground">Total Cases</h1>
                    <p className="text-3xl font-bold text-primary">{statusCounts?.total ?? '-'}</p>
                </div>
            </SidebarHeader>
            <SidebarContent className="px-0">
                <SidebarMenu>
                    {/* Progress Section */}
                    <SidebarMenuItem>
                        <button
                            onClick={() => toggleSection('Progress')}
                            className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-sidebar-foreground hover:bg-sidebar-accent"
                        >
                            <span>Progress</span>
                            <ChevronDown
                                className={`h-4 w-4 transition-transform ${expandedSections.includes('Progress') ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        {expandedSections.includes('Progress') && (
                            <SidebarMenuSub className="px-0">
                                {progressItems.map((item) => (
                                    <SidebarMenuSubItem key={item.status} className="px-0">
                                        <SidebarMenuSubButton
                                            asChild
                                            className="flex items-center justify-between px-6 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
                                        >
                                            <a href={`/dashboard/?status=${item.status}`}>
                                                <div className="flex items-center gap-2">
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.label}</span>
                                                </div>
                                                <span className="text-xs font-semibold text-muted-foreground">
                                                    {item.count > 0 ? item.count : ''}
                                                </span>
                                            </a>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        )}
                    </SidebarMenuItem>

                    {/* Other Items */}
                    {otherItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuButton
                                asChild
                                className="px-4 py-3 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
                            >
                                <a href="#" className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </div>
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        {item.count > 0 ? item.count : '0'}
                                    </span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}

                    {/* Divider */}
                    <div className="my-2 border-t border-border" />

                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}
