import { Skeleton } from '@/components/Skeleton';

export default function Loading() {
  return <main className="container page tight" aria-label="Page load ho raha hai"><Skeleton variant="card" height={180}/><Skeleton variant="custom" height={56}/><Skeleton variant="custom" height={56}/></main>;
}
