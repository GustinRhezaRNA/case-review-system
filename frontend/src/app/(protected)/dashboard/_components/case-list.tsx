'use client';

import { CaseCard } from './case-card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCases } from '@/api/case';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop';

interface CaseCardProps {
  id: string;
  date: string;
  time: string;
  caseId: string;
  zone: string;
  riskLevel: 'High Risk' | 'Medium Risk' | 'Low Risk';
  category: string;
  image: string;
  status: string;
}

// Helper function to determine risk level based on status (mock not fullt functional)
function mapRisk(caseData: any): 'High Risk' | 'Medium Risk' | 'Low Risk' {
  const statusName = caseData.status?.name || '';

  if (statusName === 'TO_BE_REVIEWED') {
    return 'High Risk';
  } else if (statusName === 'REVIEW_SUBMITTED') {
    return 'Medium Risk';
  }
  return 'Low Risk';
}

export function CaseList() {
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get('status');
  // Convert URL param format (to-be-reviewed) to API format (TO_BE_REVIEWED)
  const statusFilter = statusParam ? statusParam.toUpperCase().replace(/-/g, '_') : undefined;

  const [cases, setCases] = useState<CaseCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const itemsPerPage = 6;

  // Reset to page 1 when status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch cases when page, search, or status changes
  useEffect(() => {
    setLoading(true);
    console.log('Fetching cases for page:', currentPage, 'search:', debouncedSearch, 'status:', statusFilter);
    getCases(currentPage, itemsPerPage, debouncedSearch || undefined, statusFilter)
      .then((res) => {
        console.log('API Response:', res);
        console.log('Cases data:', res.data);

        const mapped: CaseCardProps[] = res.data.data.map((c: any) => {
          const dateObj = new Date(c.createdAt);

          return {
            id: c.id,
            date: dateObj.toLocaleDateString(),
            time: dateObj.toLocaleTimeString(),
            caseId: `#${c.id.slice(0, 6)}`,
            zone: c.assignedUser?.name || 'Unassigned',
            riskLevel: mapRisk(c),
            category: c.title,
            image: DEFAULT_IMAGE,
            status: c.status.name,
          };
        });

        console.log('Mapped cases:', mapped);
        setCases(mapped);
        setTotalPages(res.data.meta.totalPages);
      })
      .catch((error) => {
        console.error('Error fetching cases:', error);
      })
      .finally(() => setLoading(false));
  }, [currentPage, debouncedSearch, statusFilter]);

  const currentCases = cases;

  if (loading) {
    return <div className="p-6">Loading cases...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className=" bg-card p-6 pb-1">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search cases..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto p-6">
        {currentCases.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No cases found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentCases.map((c) => (
              <CaseCard key={c.id} {...c} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="border-t p-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage > 1 && setCurrentPage((p) => p - 1)}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>

            {(() => {
              const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];

              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);

                if (currentPage <= 4) {
                  for (let i = 2; i <= 5; i++) pages.push(i);
                  pages.push('ellipsis-end');
                  pages.push(totalPages);
                } else if (currentPage >= totalPages - 3) {
                  pages.push('ellipsis-start');
                  for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push('ellipsis-start');
                  pages.push(currentPage - 1);
                  pages.push(currentPage);
                  pages.push(currentPage + 1);
                  pages.push('ellipsis-end');
                  pages.push(totalPages);
                }
              }

              return pages.map((p, idx) =>
                p === 'ellipsis-start' || p === 'ellipsis-end' ? (
                  <PaginationItem key={`${p}-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={currentPage === p}
                      onClick={() => setCurrentPage(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              );
            })()}

            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < totalPages && setCurrentPage((p) => p + 1)}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
