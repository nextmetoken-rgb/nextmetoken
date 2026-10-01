import Link from 'next/link';
import { Ticket } from 'lucide-react';
import { brand } from '@/lib/brand';
export default function Logo() {
  return (
    <Link href="/" className="logo" data-testid="logo">
      <span className="logo-mark"><Ticket size={20} strokeWidth={2} aria-hidden="true" /></span>
      <span>{brand.name}</span>
    </Link>
  );
}
