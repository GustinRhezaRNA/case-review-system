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
    Flag,
    Star,
    ChevronDown,
    BarChart3,
} from 'lucide-react';
import { useState } from 'react';

export function AppSidebar() {
    const [expandedSections, setExpandedSections] = useState<string[]>(['Progress']);

    const toggleSection = (section: string) => {
        setExpandedSections((prev) =>
            prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
        );
    };

    const progressItems = [
        { label: 'To Review', count: 8, icon: AlertCircle },
        { label: 'Review Submitted', count: 9, icon: CheckCircle },
        { label: 'Observation', count: 15, icon: Eye },
        { label: 'Complete', count: 24, icon: CheckCircle },
    ];

    const otherItems = [
        { label: 'Assigned', count: 4, icon: BarChart3 },
        { label: 'Flagged', count: 8, icon: Flag },
        { label: 'Favorite', count: 9, icon: Star },
    ];

    const vendors = [
        { label: 'PTSM Pte Ltd', count: 8 },
        { label: 'Waste Link Pte Ltd', count: 9 },
        { label: 'Trueman Pte Ltd', count: 3 },
        { label: 'Longblue Services', count: 3 },
        { label: 'Smart Services', count: 5 },
    ];

    const equipment = [
        { label: 'Malfunction', count: 5 },
        { label: 'Unattendence', count: 3 },
    ];

    return (
        <Sidebar className="border-r border-border bg-sidebar">
            <SidebarHeader className="border-b border-border px-4 py-4">
                <div>
                    <h1 className="text-xl font-bold text-sidebar-foreground">Total Cases</h1>
                    <p className="text-3xl font-bold text-primary">34</p>
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
                                    <SidebarMenuSubItem key={item.label} className="px-0">
                                        <SidebarMenuSubButton
                                            asChild
                                            className="flex items-center justify-between px-6 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
                                        >
                                            <a href={`/?status=${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                                                <div className="flex items-center gap-2">
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.label}</span>
                                                </div>
                                                <span className="text-xs font-semibold text-muted-foreground">
                                                    {item.count}
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
                                        {item.count}
                                    </span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}

                    {/* Divider */}
                    <div className="my-2 border-t border-border" />

                    {/* Tagged Section */}
                    <SidebarMenuItem>
                        <button
                            onClick={() => toggleSection('Tagged')}
                            className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-sidebar-foreground hover:bg-sidebar-accent"
                        >
                            <span>Tagged</span>
                            <ChevronDown
                                className={`h-4 w-4 transition-transform ${expandedSections.includes('Tagged') ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        {expandedSections.includes('Tagged') && (
                            <div className="px-4 py-2">
                                {/* Vendors */}
                                <button
                                    onClick={() => toggleSection('Vendors')}
                                    className="flex w-full items-center justify-between py-2 text-xs font-semibold text-sidebar-foreground hover:bg-sidebar-accent px-2 rounded"
                                >
                                    <span>Vendors</span>
                                    <ChevronDown
                                        className={`h-3 w-3 transition-transform ${expandedSections.includes('Vendors') ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                {expandedSections.includes('Vendors') && (
                                    <ul className="space-y-1 pl-2 py-1">
                                        {vendors.map((vendor) => (
                                            <li
                                                key={vendor.label}
                                                className="flex items-center justify-between text-xs text-muted-foreground hover:text-sidebar-foreground py-1"
                                            >
                                                <span className="text-left">• {vendor.label}</span>
                                                <span className="text-xs">{vendor.count}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Equipment */}
                                <button
                                    onClick={() => toggleSection('Equipment')}
                                    className="flex w-full items-center justify-between py-2 text-xs font-semibold text-sidebar-foreground hover:bg-sidebar-accent px-2 rounded mt-2"
                                >
                                    <span>Equipment</span>
                                    <ChevronDown
                                        className={`h-3 w-3 transition-transform ${expandedSections.includes('Equipment') ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                {expandedSections.includes('Equipment') && (
                                    <ul className="space-y-1 pl-2 py-1">
                                        {equipment.map((item) => (
                                            <li
                                                key={item.label}
                                                className="flex items-center justify-between text-xs text-muted-foreground hover:text-sidebar-foreground py-1"
                                            >
                                                <span className="text-left">• {item.label}</span>
                                                <span className="text-xs">{item.count}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Operations */}
                                <button
                                    onClick={() => toggleSection('Operations')}
                                    className="flex w-full items-center justify-between py-2 text-xs font-semibold text-sidebar-foreground hover:bg-sidebar-accent px-2 rounded mt-2"
                                >
                                    <span>Operations</span>
                                    <ChevronDown
                                        className={`h-3 w-3 transition-transform ${expandedSections.includes('Operations') ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {/* Production */}
                                <button
                                    onClick={() => toggleSection('Production')}
                                    className="flex w-full items-center justify-between py-2 text-xs font-semibold text-sidebar-foreground hover:bg-sidebar-accent px-2 rounded mt-1"
                                >
                                    <span>Production</span>
                                    <ChevronDown
                                        className={`h-3 w-3 transition-transform ${expandedSections.includes('Production') ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                            </div>
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}
