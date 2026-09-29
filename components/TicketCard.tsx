import { t } from '@/lib/i18n';
type Props = { current: number; mine: number; testId?: string };
export default function TicketCard({ current, mine, testId }: Props) {
  return (
    <div className="ticket" data-testid={testId} role="img" aria-label={`${t('ticket.now')} ${current}, ${t('ticket.yours')} ${mine}`}>
      <div className="ticket-top">
        <span className="t-overline ov">{t('ticket.now')}</span>
        <span className="t-number-m">{current}</span>
      </div>
      <div className="ticket-perf" />
      <div className="ticket-bot">
        <span className="t-overline ov">{t('ticket.yours')}</span>
        <span className="t-display-l">{mine}</span>
      </div>
    </div>
  );
}
