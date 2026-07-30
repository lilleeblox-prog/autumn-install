import { cn } from '@/lib/utils';

interface SeasonBadgeProps {
  season: 'fall' | 'winter' | 'summer';
  className?: string;
}

const seasonStyles = {
  fall: 'bg-primary/10 text-primary border-primary/20',
  winter: 'bg-secondary/10 text-secondary border-secondary/20',
  summer: 'bg-accent/10 text-accent-foreground border-accent/20',
};

const seasonLabels = {
  fall: 'Fall',
  winter: 'Winter',
  summer: 'Summer',
};

export function SeasonBadge({ season, className }: SeasonBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 text-xs font-medium tracking-wide uppercase border rounded-sm',
        seasonStyles[season],
        className
      )}
      data-testid={`badge-season-${season}`}
    >
      {seasonLabels[season]}
    </span>
  );
}
