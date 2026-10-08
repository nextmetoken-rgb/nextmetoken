'use client';
import { useEffect, useState } from 'react';
type Language = 'hi-Latn'|'en'|'hi-Deva';
const label:Record<Language,string>={'hi-Latn':'Hinglish',en:'English','hi-Deva':'हिन्दी'};
export function HomeLanguagePicker(){const [language,setLanguage]=useState<Language>('hi-Latn');useEffect(()=>{const saved=localStorage.getItem('tokenapp-language') as Language|null;if(saved&&saved in label)setLanguage(saved)},[]);const change=(value:Language)=>{setLanguage(value);localStorage.setItem('tokenapp-language',value);document.cookie=`tokenapp-language=${value}; path=/; max-age=31536000; samesite=lax`;document.documentElement.lang=value==='hi-Deva'?'hi':value;window.dispatchEvent(new Event('tokenapp-language-change'))};return <label className="home-language">Language<select aria-label="Language" value={language} onChange={event=>change(event.target.value as Language)}>{Object.entries(label).map(([value,name])=><option key={value} value={value}>{name}</option>)}</select></label>}
