import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';


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

export function CaseCard({
    id,
    date,
    time,
    caseId,
    zone,
    riskLevel,
    category,
    image,
    status,
}: CaseCardProps) {
    const riskColor =
        riskLevel === 'High Risk'
            ? 'bg-destructive text-destructive-foreground'
            : riskLevel === 'Medium Risk'
                ? 'bg-amber-500 text-white'
                : 'bg-emerald-500 text-white';

    return (
        <Link to={`/dashboard/${id}`}>
            <Card className="overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {date} {time}
                            </p>
                            <p className="text-xs text-muted-foreground font-semibold mt-1">Case ID {caseId}</p>
                        </div>
                        <Badge className={`text-xs px-2 py-1 ${riskColor}`}>{riskLevel}</Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {zone}
                        </p>
                    </div>

                    <div className="mb-3">
                        <Badge variant="outline" className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/30">
                            {category}
                        </Badge>
                    </div>

                    <div className="relative w-full h-32 rounded-lg overflow-hidden bg-secondary mb-3">
                        <img
                            src={image || "/placeholder.svg"}
                            alt={caseId}
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    </div>

                    <p className="text-xs text-muted-foreground">{status}</p>
                </div>
            </Card>
        </Link>
    );
}
