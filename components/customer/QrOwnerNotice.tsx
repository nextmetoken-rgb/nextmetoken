'use client';
import {useRouter} from 'next/navigation';import {Info} from 'lucide-react';import {Card} from '@/components/Cards';import {Button} from '@/components/Button';
export function QrOwnerNotice({queueId}:{queueId:string}){const router=useRouter();return <main className="container page tight"><Card><div className="row mid"><Info color="var(--c-accent)"/><p className="t-body">Aap apna hi QR scan kar rahe hain.</p></div><Button fullWidth onClick={()=>router.push(`/app/business/${queueId}`)}>Queue kholein</Button></Card></main>}
