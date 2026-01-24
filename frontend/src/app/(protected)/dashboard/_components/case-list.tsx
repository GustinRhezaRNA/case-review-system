'use client';

import { CaseCard } from './case-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const mockCases = [
  {
    id: '1',
    date: 'Aug 23, 2022',
    time: '14:11:08 PM',
    caseId: '#233333',
    zone: 'Zone L2A',
    riskLevel: 'High Risk' as const,
    category: 'Vehicle Control',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    status: 'Review Submitted',
  },
  {
    id: '2',
    date: 'Aug 23, 2022',
    time: '14:11:08 PM',
    caseId: '#233333',
    zone: 'Zone L2A',
    riskLevel: 'High Risk' as const,
    category: 'Vehicle Control',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    status: 'Review Submitted',
  },
  {
    id: '3',
    date: 'Aug 23, 2022',
    time: '14:11:08 PM',
    caseId: '#233333',
    zone: 'Zone L2A',
    riskLevel: 'High Risk' as const,
    category: 'Vehicle Control',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    status: 'Review Submitted',
  },
  {
    id: '4',
    date: 'Aug 23, 2022',
    time: '14:11:08 PM',
    caseId: '#233333',
    zone: 'Zone L2A',
    riskLevel: 'High Risk' as const,
    category: 'Vehicle Control',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    status: 'Review Submitted',
  },
  {
    id: '5',
    date: 'Aug 23, 2022',
    time: '14:11:08 PM',
    caseId: '#233333',
    zone: 'Zone L2A',
    riskLevel: 'High Risk' as const,
    category: 'Vehicle Control',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    status: 'Review Submitted',
  },
  {
    id: '6',
    date: 'Aug 23, 2022',
    time: '14:11:08 PM',
    caseId: '#233333',
    zone: 'Zone L2A',
    riskLevel: 'High Risk' as const,
    category: 'Vehicle Control',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    status: 'Review Submitted',
  },
];

export function CaseList() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(mockCases.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCases = mockCases.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">Review Submitted</h1>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search cases..."
              className="pl-10 bg-background border-border"
            />
          </div>

          <div className="flex gap-2">
            <Select defaultValue="time">
              <SelectTrigger className="w-24 bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time">Time</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="zone">
              <SelectTrigger className="w-24 bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zone">Zone</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="category">
              <SelectTrigger className="w-28 bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="progress">
              <SelectTrigger className="w-28 bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="progress">Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {currentCases.map((caseItem) => (
            <CaseCard key={caseItem.id} {...caseItem} />
          ))}
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
