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
    Trash2,
    Star,
    Flag,
    ChevronLeft,
    ChevronRight,
    Send,
    Share2,
    Eye,
} from 'lucide-react';

import { useState } from 'react';

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
    const [comment, setComment] = useState('');

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header with Back Button */}
            <div className="border-b border-border bg-card p-4 md:p-6">
                <a href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm font-medium">Back to List</span>
                </a>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground mb-1">Review Submitted</h1>
                        <p className="text-sm text-muted-foreground">Case ID: #2333333</p>
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
                                <div className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-foreground">To Review</p>
                                    </div>
                                </div>

                                <div className="ml-4 h-8 border-l-2 border-border" />

                                <div className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-foreground">Review</p>
                                    </div>
                                </div>

                                <div className="ml-4 h-8 border-l-2 border-border" />

                                <div className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                                        3
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-foreground">Observation</p>
                                    </div>
                                </div>

                                <div className="ml-4 h-8 border-l-2 border-border" />

                                <div className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-bold">
                                        4
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-muted-foreground">Complete</p>
                                    </div>
                                </div>
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
                                    <p className="text-foreground">Daniel Bakerman</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground font-semibold mb-1">Assigned</p>
                                    <p className="text-foreground">Chad Lakefield</p>
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
                                    <Select defaultValue="complete">
                                        <SelectTrigger className="w-full bg-background border-border">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="complete">Complete</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="in-review">In Review</SelectItem>
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
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    Submit
                </Button>
            </div>
        </div>
    );
}
