import { Skeleton } from '@/components/Skeleton';

export default function AppLoading() {
  return <main className="container page tight" aria-label="Page load ho raha hai"><Skeleton variant="card" height={160}/><Skeleton variant="custom" height={64}/><Skeleton variant="custom" height={64}/><Skeleton variant="custom" height={64}/></main>;
}
