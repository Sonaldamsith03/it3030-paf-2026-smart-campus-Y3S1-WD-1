import React from 'react';
import { TicketStatus } from './ticket';
import { cn } from '../../lib/utils';

interface TicketStatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

export const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({ status, className }) => {
  const styles = {
    OPEN: 'text-accent border-accent/20 bg-accent/5 shadow-glow shadow-accent/5',
    REJECTED: 'text-red-600 dark:text-red-400 border-red-500/20 bg-red-500/5',
    IN_PROGRESS: 'text-amber-600 dark:text-amber-500 border-amber-500/20 bg-amber-500/5',
    RESOLVED: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    CLOSED: 'text-ink/20 border-ink/10 bg-ink/5 shadow-none',
  };

  return (
    <span className={cn(
      "px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border italic serif-italic backdrop-blur-md transition-all duration-500",
      styles[status],
      className
    )}>
      {status.replace('_', ' ')}
    </span>
  );
};
