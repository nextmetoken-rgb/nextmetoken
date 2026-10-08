'use client';
import React from 'react';import {useRouter} from 'next/navigation';import {ChevronRight,Search} from 'lucide-react';
import {AppBar} from '@/components/AppBar';import {Card} from '@/components/Cards';import {GuideCard,type GuideBlock} from '@/components/GuideCard';import {SegmentedControl} from '@/components/SegmentedControl';import {TextField} from '@/components/TextField';import {EmptyState} from '@/components/EmptyState';
type Entry={title:string;what:string;how:string;care:string};
const customer:Entry[]=[
 {title:'QR scan karna',what:'Dukaan ke QR se line me judne ka tarika.',how:'1) Scan tab kholein ya phone ka camera use karein 2) QR ko frame me rakhein 3) “Token lein” dabayein',care:'QR sirf dukaan/counter pe scan karna hai. Kisi ka bheja hua QR nahi chalta.'},
 {title:'Token lena',what:'Line me aapka number.',how:'1) QR scan karein 2) Naam check karein 3) “Token lein”',care:'Ek queue me ek hi active token milta hai.'},
 {title:'Live screen kaise padhein',what:'Aapki line ka live haal.',how:'Upar bada number = abhi chal raha number. Neeche “Aapka token” = aapka number.',care:'Number apne aap badalta hai, refresh nahi karna.'},
 {title:'“Andaza” ka matlab',what:'Aapke number ke aane ka anumaan.',how:'Ye pichhle logon ke time se nikala jata hai.',care:'Ye 100% sahi nahi hota, thoda upar-neeche ho sakta hai.'},
 {title:'Line chhodna',what:'Token wapas dena.',how:'Live screen par “Line chhodein” > “Haan, chhodein”',care:'Chhodne ke baad number wapas nahi milta.'},
 {title:'Line ke log',what:'Line me kaun-kaun hai.',how:'Live screen par “Line ke log dekhein”.',care:'Sabke poore naam dikhte hain.'},
 {title:'Naam badalna',what:'Ek line me alag naam rakhna.',how:'Token lete waqt “Badlein” dabayein. Default naam Profile me badlein.',care:'Ye naam is line ke sabhi log dekhte hain.'},
 {title:'Multiple dukaan',what:'Ek saath kai line me token.',how:'Har dukaan ka QR scan karein. “Mere Tokens” me sab dikhenge.',care:'Ek dukaan me sirf ek token.'},
 {title:'Saath me doosre log',what:'Group ya family ke liye.',how:'Counter par owner ko naam batayein, wo aapke liye bhi number de dega.',care:'Aap khud ek se zyada token nahi le sakte.'},
 {title:'History',what:'Purane tokens.',how:'Mere Tokens > Options > History',care:'Token poora hone ke 10 min baad history me jata hai.'},
 {title:'App install karna',what:'Token App ko phone ya computer par app ki tarah kholna.',how:'Android: supported browser me Install app dabayein; iPhone/iPad: Safari Share > Add to Home Screen; Computer: Chrome/Edge address-bar install icon ya browser menu > Install app.',care:'Direct install prompt sirf supported browsers me aata hai. iPhone aur kuch browsers me manual Add to Home Screen/Install steps karne padte hain.'},
];
const owner:Entry[]=[
 {title:'Queue banana',what:'Aapki dukaan ki line.',how:'Business tab > Nayi queue banayein > naam, limit, time > “Queue banayein”.',care:'Queue banana free hai.'},
 {title:'Token limit',what:'Kitne token tak dena hai.',how:'Step 2 me “Koi limit nahi” band karke number likhein.',care:'Limit poori hone par naye customer ko token nahi milega.'},
 {title:'“Ek token me kitna time”',what:'Andaza nikalne ke liye.',how:'“Automatic” chunein ya minutes khud likhein.',care:'Ye sirf andaza hai. Number khud nahi badalta.'},
 {title:'QR print karna',what:'Counter par lagane wala QR.',how:'QR screen > “Print karein / PDF”.',care:'QR sirf counter par lagayein. Share ka option nahi hai.'},
 {title:'Agla / Pichla / Undo',what:'Number aage-peeche karna.',how:'Console me “Agla” dabayein. Galti ho toh 5 second me “Undo”.',care:'“Pichla” sirf galti sudharne ke liye hai.'},
 {title:'Walk-in add karna',what:'Jinke paas phone nahi.',how:'Console > “Walk-in add karein” > naam likhein > “Number dein”.',care:'Zyada log saath aaye toh sabke liye yahi karein.'},
 {title:'Kisi ko hatana',what:'Spam ya no-show hatana.',how:'List me row ke cross par dabayein (ya ⋮ > Hatao).',care:'Hatate hi agla number turant aage aata hai. Undo 5 second me.'},
 {title:'Line rok dena',what:'Thodi der ke liye line pause.',how:'Console > ⋮ > “Line rok dein”.',care:'Customer ko “Line ruki hai” dikhta hai.'},
 {title:'Din khatam',what:'Aaj ka kaam band.',how:'Console > ⋮ > “Din khatam (End day)”.',care:'Customer scan karenge toh “Ye line band hai” dikhega.'},
 {title:'Agle din dobara shuru',what:'Wahi QR, naya number.',how:'Business tab > Purani queue > “Dobara shuru karein”.',care:'Shuruaati number chunein; purani history safe rehti hai.'},
 {title:'Awaaz announcement',what:'Number bolke batana.',how:'Console me “Awaaz announcement” chalu karein.',care:'Awaaz tabhi aati hai jab screen chalu ho. Phone off ya lock karne par awaaz nahi aayegi.'},
 {title:'History',what:'Purane din ka record.',how:'Console > ⋮ > History.',care:'Har din ka start aur end time dikhta hai.'},
];
export default function GuidePage(){const [tab,setTab]=React.useState<'customer'|'owner'>('customer');const [search,setSearch]=React.useState('');const [query,setQuery]=React.useState('');const [open,setOpen]=React.useState<string|null>(null);const router=useRouter();React.useEffect(()=>{const timer=setTimeout(()=>setQuery(search.trim().toLocaleLowerCase()),150);return()=>clearTimeout(timer)},[search]);const list=(tab==='customer'?customer:owner).filter(x=>`${x.title} ${x.what} ${x.how} ${x.care}`.toLocaleLowerCase().includes(query));const blocks=(x:Entry):GuideBlock[]=>[{label:'Ye kya hai',text:x.what},{label:'Kaise karein',text:x.how},{label:'Dhyan rakhein',text:x.care}];return <><AppBar title="Guide (Madad)" onBack={()=>router.back()} testId="guide.appbar"/><main className="container page tight" data-testid="guide"><TextField label="Guide" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Kuch dhundhein…" testId="guide.search"/><SegmentedControl options={[{value:'customer',label:'Customer'},{value:'owner',label:'Owner'}]} value={tab} onChange={v=>{setTab(v);setOpen(null)}} testId="guide.tabs"/>{list.length===0?<EmptyState icon={<Search/>} title="Kuch nahi mila" body="Dusre shabd se dhundhein."/>:<div className="biz-list" data-testid="guide.list">{list.map(x=><GuideCard key={x.title} title={x.title} blocks={blocks(x)} isOpen={open===x.title} onToggle={()=>setOpen(open===x.title?null:x.title)} testId={`guide.card.${x.title}`}/>)}</div>}</main></>}
