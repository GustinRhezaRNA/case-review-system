'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ArrowLeft,
    Star,
    Flag,
    ChevronLeft,
    ChevronRight,
    Send,
    Share2,
    Eye,
} from 'lucide-react';

import { useEffect, useState } from 'react';
import { getCaseDetail, getAssignableUsers, assignCase, updateCaseStatus } from '@/api/case';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

interface CaseDetailProps {
    id: string;
}

const mockComments = [
    {
        id: '1',
        date: 'Aug 23, 2022',
        time: '10:32 AM',
        author: 'Daniel Bakerman',
        text: 'This behaviour has been noted. Keith, could you please inform your team about potential hazard this will cause.',
    },
    {
        id: '2',
        date: 'Aug 23, 2022',
        time: '10:32 AM',
        author: 'Chad Lakefield',
        text: 'This behaviour has been noted. Keith, could you please inform your team about potential hazard this will cause.',
    },
];

export function CaseDetail({ id }: CaseDetailProps) {
    const { user } = useAuth();
    const [caseData, setCaseData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]);
    const [comment, setComment] = useState('');
    const [updating, setUpdating] = useState(false);

    // Draft states for deferred submission
    const [draftStatus, setDraftStatus] = useState<string>('');
    const [draftAssignee, setDraftAssignee] = useState<string>('unassigned');

    useEffect(() => {
        if (!id) return;
        setLoading(true);

        Promise.all([
            getCaseDetail(id),
            getAssignableUsers()
        ])
            .then(([caseRes, usersRes]) => {
                setCaseData(caseRes);
                setUsers(usersRes);
                // Initialize drafts
                setDraftStatus(caseRes.status?.name || 'TO_BE_REVIEWED');
                setDraftAssignee(caseRes.assignedTo || 'unassigned');
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleStatusChange = (value: string) => {
        setDraftStatus(value);
    };

    const handleAssignChange = (value: string) => {
        setDraftAssignee(value);
    };

    const handleSubmit = async () => {
        if (!caseData) return;
        setUpdating(true);

        const promises = [];

        // Check Status Change
        if (draftStatus && draftStatus !== caseData.status?.name) {
            promises.push(updateCaseStatus(caseData.id, draftStatus));
        }

        // Check Assignment Change
        const currentAssigneeId = caseData.assignedTo || 'unassigned';
        if (draftAssignee && draftAssignee !== currentAssigneeId) {
            if (draftAssignee !== 'unassigned') {
                promises.push(assignCase(caseData.id, draftAssignee));
            }
        }

        try {
            if (promises.length > 0) {
                await Promise.all(promises);
                // Refetch to sync state
                const res = await getCaseDetail(id);
                setCaseData(res);
                setDraftStatus(res.status?.name || 'TO_BE_REVIEWED');
                setDraftAssignee(res.assignedTo || 'unassigned');
                alert('Changes saved successfully');
            }
        } catch (error) {
            console.error('Failed to save changes:', error);
            alert('Failed to save changes');
        } finally {
            setUpdating(false);
        }
    };

    const timelineSteps = [
        { step: 1, label: 'To Review', status: 'TO_BE_REVIEWED' },
        { step: 2, label: 'Review', status: 'REVIEW_SUBMITTED' },
        { step: 3, label: 'Observation', status: 'OBSERVATION' },
        { step: 4, label: 'Complete', status: 'COMPLETE' },
    ];

    const getCurrentStepIndex = (status: string) => {
        return timelineSteps.findIndex(s => s.status === status);
    };

    if (loading) return <div>Loading...</div>;
    if (!caseData) return <div>Case not found</div>;

    const currentStepIndex = getCurrentStepIndex(caseData.status?.name);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header with Back Button */}
            <div className="border-b border-border bg-card p-4 md:p-6">
                <a href="/dashboard" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm font-medium">Back to List</span>
                </a>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground mb-1">{caseData.title}</h1>
                        <p className="text-sm text-muted-foreground">Case ID: #{caseData.id.slice(0, 6)}</p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                            <Star className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Flag className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="grid gap-6 p-4 md:p-6 md:grid-cols-2 max-w-7xl mx-auto">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Progress Timeline */}
                        <Card className="p-6">
                            <h2 className="font-bold text-foreground mb-4">Progress</h2>
                            <div className="space-y-4">
                                {timelineSteps.map((step, index) => {
                                    const isCompleted = index <= currentStepIndex;

                                    return (
                                        <div key={step.step}>
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                                                    isCompleted
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted text-muted-foreground"
                                                )}>
                                                    {step.step}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={cn(
                                                        "font-semibold",
                                                        isCompleted ? "text-foreground" : "text-muted-foreground"
                                                    )}>
                                                        {step.label}
                                                    </p>
                                                </div>
                                            </div>
                                            {index < timelineSteps.length - 1 && (
                                                <div className={cn(
                                                    "ml-4 h-8 border-l-2",
                                                    index < currentStepIndex ? "border-primary" : "border-border"
                                                )} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>

                        {/* Alert Details */}
                        <Card className="p-6">
                            <h2 className="font-bold text-foreground mb-4">Alert</h2>
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <span className="text-sm text-muted-foreground font-semibold">Object Obstruction</span>
                                    <Badge className="bg-destructive">High Risk</Badge>
                                </div>
                            </div>
                        </Card>

                        {/* Case Review Form */}
                        <Card className="p-6">
                            <h2 className="font-bold text-foreground mb-4">Case Review</h2>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground font-semibold mb-1">Authority*</p>
                                    <p className="text-foreground">{caseData.assigner?.name || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground font-semibold mb-1">Assigned</p>
                                    <Select
                                        value={draftAssignee}
                                        onValueChange={handleAssignChange}
                                        // Disabled if:
                                        // 1. Updating
                                        // 2. No users to assign to (Agent, or empty list)
                                        disabled={updating || users.length === 0}
                                    >
                                        <SelectTrigger className="w-full bg-background border-border h-8 text-sm">
                                            <SelectValue placeholder="Select user" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unassigned">Unassigned</SelectItem>
                                            {[
                                                ...users,
                                                // Add the currently assigned user if they are not in the list (e.g. ADMIN)
                                                ...(caseData.assignedUser && !users.find(u => u.id === caseData.assignedUser.id)
                                                    ? [caseData.assignedUser]
                                                    : [])
                                            ].map((user) => (
                                                <SelectItem key={user.id} value={user.id}>
                                                    {user.name} ({user.role?.name || 'Unknown Role'})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <p className="text-muted-foreground font-semibold mb-1">Team</p>
                                    <p className="text-foreground">Operation Team</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground font-semibold mb-1">Tag</p>
                                    <p className="text-foreground">Vendor</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground font-semibold mb-1">Sub Tag</p>
                                    <p className="text-foreground">PTSM Pte Ltd</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground font-semibold mb-2">Status</p>
                                    <Select
                                        value={draftStatus}
                                        onValueChange={handleStatusChange}
                                        disabled={
                                            updating ||
                                            user?.role === 'ADMIN' ||
                                            // Agent/Supervisor can only update if assigned to them
                                            ((user?.role === 'AGENT' || user?.role === 'SUPERVISOR') && caseData.assignedTo !== user?.id)
                                        }
                                    >
                                        <SelectTrigger className="w-full bg-background border-border">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TO_BE_REVIEWED">To Review</SelectItem>
                                            <SelectItem value="REVIEW_SUBMITTED">Review Submitted</SelectItem>
                                            <SelectItem value="OBSERVATION">Observation</SelectItem>
                                            <SelectItem value="COMPLETE">Complete</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <p className="text-xs text-muted-foreground italic mt-3">
                                    * Only authority could mark complete for case review
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Image */}
                        <Card className="overflow-hidden p-4">
                            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-secondary mb-4">
                                <img
                                    src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop"
                                    alt="Case image"
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>

                        {/* Company Info */}
                        <Card className="p-6">
                            <h3 className="font-bold text-foreground mb-4">PTSM Pte Ltd</h3>
                            <p className="text-sm text-muted-foreground">Not wearing PPE Equipment</p>
                        </Card>

                        {/* Comments Section */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-foreground">Comments</h3>
                                <p className="text-xs text-muted-foreground">Updated Aug 23, 2022 10:32 AM</p>
                            </div>

                            <div className="space-y-4 mb-4 max-h-48 overflow-y-auto">
                                {mockComments.map((c) => (
                                    <div key={c.id} className="border-b border-border pb-4 last:border-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <p className="text-sm font-semibold text-foreground">{c.author}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {c.date} {c.time}
                                            </p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{c.text}</p>
                                        <button className="text-xs text-primary hover:text-primary/80 mt-2">
                                            Edit
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Comment Input */}
                            <div className="space-y-3 border-t border-border pt-4">
                                <Textarea
                                    placeholder="Type comment here..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="resize-none bg-background border-border"
                                    rows={3}
                                />
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                    <div className="flex-1" />
                                    <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                                        <Send className="h-4 w-4" />
                                        Send
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border bg-card p-4 md:p-6">
                <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    onClick={handleSubmit}
                    disabled={updating}
                >
                    Submit
                </Button>
            </div>
        </div>
    );
}
