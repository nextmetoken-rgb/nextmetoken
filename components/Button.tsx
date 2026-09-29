import Link from 'next/link';
import type { ReactNode } from 'react';
type Props = { href: string; size?: 'sm' | 'md'; wrap?: boolean; testId?: string; children: ReactNode };
export default function ButtonLink({ href, size = 'md', wrap = false, testId, children }: Props) {
  const cls = ['btn', 'btn-primary', size === 'sm' ? 'btn-sm' : '', wrap ? 'btn-wrap' : ''].join(' ').trim();
  return <Link href={href} className={cls} data-testid={testId}>{children}</Link>;
}
