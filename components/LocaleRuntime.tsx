'use client';

import { useEffect } from 'react';

type Locale = 'en' | 'hi-Deva' | 'hi-Latn';
const words: Record<'en' | 'hi-Deva', Record<string, string>> = {
  en: {
    'Next Me Token': 'Next Me Token', 'Line ka jhanjhat khatam. Token QR se.': 'Skip the queue hassle. Get your token by QR.',
    'Customer ke liye QR token banayein, aur QR scan karke apna token number lein.': 'Create a QR token for your customers, or scan a QR code to get your number.',
    'Login karke shuru karein': 'Log in to get started', 'Google se continue karein': 'Continue with Google',
    'Shuru kaise karein': 'How to get started', 'Token number paane ke liye': 'Get a token number', 'Business QR token shuru karne ke liye': 'Start a business QR queue',
    'Google se login karein.': 'Log in with Google.', 'Apna poora naam daalein.': 'Enter your full name.', 'Counter par QR scan karke naam confirm karein.': 'Scan the counter QR code and confirm your name.', 'Aapko live updates ke saath token mil jayega.': 'Get your token with live updates.',
    'Business tab me jaakar nayi queue banayein.': 'Open the Business tab and create a queue.', 'Business ka naam daalein aur queue ko apne hisaab se set karein.': 'Enter your business name and set up the queue.', 'QR milne par use dukaan ke bahar lagayein, print karein ya save karein.': 'Display the QR at your shop, print it, or save it.', 'Live queue screen par customer ke naam aur token number dekhein.': 'See customer names and token numbers on the live queue screen.', 'Agla aur Pichla dabakar number aage badhayein.': 'Use Next and Previous to move the number.',
    'Kaun kaun use kar sakta hai': 'Who can use it', 'Clinic aur lab': 'Clinics and labs', 'Repair aur service center': 'Repair and service centers', 'Bank aur office counter': 'Bank and office counters', 'Mithai aur chai ki dukaan': 'Sweet and tea shops', 'Aur kai jagah': 'And many other places', 'Line ka jhanjhat? Wahan Next Me Token.': 'A queue hassle? Use Next Me Token there.',
    'DEMO TICKET · YE ASLI TOKEN NAHI HAI': 'DEMO TICKET · THIS IS NOT A REAL TOKEN', 'Sahi token number paane ke liye login karein aur business ka QR scan karein.': 'Log in and scan the business QR code to get your real token number.', 'Aksar pooche jaane wale sawal': 'Frequently asked questions', 'Terms': 'Terms', 'Privacy Policy': 'Privacy Policy', 'Profile': 'Profile', 'Business': 'Business', 'Mere Tokens': 'My Tokens', 'Scan': 'Scan', 'Language': 'Language', 'Awaaz': 'Sound', 'Chalu': 'On', 'Band': 'Off', 'Logout': 'Log out', 'Account delete karein': 'Delete account', 'Guide (Madad)': 'Guide', 'Naam badlein': 'Edit name', 'Save karein': 'Save', 'Wapas': 'Back', 'Pichla': 'Previous', 'Agla': 'Next', 'Dobara shuru karein': 'Start again', 'Jahan chhoda tha wahan se': 'Continue where you left off', 'History dekhein': 'View history', 'Settings badlein': 'Change settings', 'Delete karein': 'Delete', 'QR code': 'QR code', 'Print karein / PDF': 'Print / PDF', 'Image save karein': 'Save image', 'Page khul nahi paya. Kripya refresh karein.': 'Page could not be opened. Please refresh.', 'Refresh karein': 'Refresh', 'ABHI CHAL RAHA HAI': 'NOW SERVING', 'Abhi kisi ko nahi bulaya': 'No one has been called yet', 'Abhi koi intezar me nahi': 'No one is waiting yet', 'Customer QR scan karke judenge.': 'Customers can join by scanning the QR code.', 'SCAN KARKE TOKEN LEIN': 'SCAN TO GET A TOKEN', 'QR dikhao / print': 'Show / print QR', 'Walk-in add karein': 'Add walk-in', 'Aaj ka kaam khatam karein?': 'End today’s session?', 'Din khatam karein': 'End the day', 'Line chalu karein': 'Resume line', 'Line rok dein': 'Pause line', 'Number nikal gaya (Skip)': 'Skip this number', 'Koi limit nahi': 'No limit', 'Aage badhein': 'Continue', 'Queue banayein': 'Create queue', 'Agla token {n} se shuru hoga': 'Next token starts at {n}',
  },
  'hi-Deva': {
    'Line ka jhanjhat khatam. Token QR se.': 'लाइन का झंझट खत्म। QR से टोकन लें।',
    'Customer ke liye QR token banayein, aur QR scan karke apna token number lein.': 'ग्राहक के लिए QR टोकन बनाएँ, या QR स्कैन करके अपना नंबर लें।',
    'Login karke shuru karein': 'लॉग इन करके शुरू करें', 'Google se continue karein': 'Google से जारी रखें',
    'Shuru kaise karein': 'शुरू कैसे करें', 'Token number paane ke liye': 'टोकन नंबर पाने के लिए', 'Business QR token shuru karne ke liye': 'बिज़नेस QR टोकन शुरू करने के लिए',
    'Google se login karein.': 'Google से लॉग इन करें।', 'Apna poora naam daalein.': 'अपना पूरा नाम डालें।', 'Counter par QR scan karke naam confirm karein.': 'काउंटर पर QR स्कैन करके नाम पक्का करें।', 'Aapko live updates ke saath token mil jayega.': 'लाइव अपडेट के साथ टोकन मिल जाएगा।',
    'Business tab me jaakar nayi queue banayein.': 'Business टैब में जाकर नई कतार बनाएँ।', 'Business ka naam daalein aur queue ko apne hisaab se set karein.': 'बिज़नेस का नाम डालें और कतार को अपने हिसाब से सेट करें।', 'QR milne par use dukaan ke bahar lagayein, print karein ya save karein.': 'QR मिलने पर उसे दुकान के बाहर लगाएँ, प्रिंट करें या सेव करें।', 'Live queue screen par customer ke naam aur token number dekhein.': 'लाइव कतार स्क्रीन पर ग्राहक का नाम और टोकन नंबर देखें।', 'Agla aur Pichla dabakar number aage badhayein.': 'अगला और पिछला दबाकर नंबर आगे बढ़ाएँ।',
    'Kaun kaun use kar sakta hai': 'कौन इसका इस्तेमाल कर सकता है', 'Clinic aur lab': 'क्लिनिक और लैब', 'Repair aur service center': 'मरम्मत और सर्विस सेंटर', 'Bank aur office counter': 'बैंक और ऑफिस काउंटर', 'Mithai aur chai ki dukaan': 'मिठाई और चाय की दुकान', 'Aur kai jagah': 'और कई जगह', 'Line ka jhanjhat? Wahan Next Me Token.': 'लाइन का झंझट? वहाँ Next Me Token।',
    'DEMO TICKET · YE ASLI TOKEN NAHI HAI': 'डेमो टिकट · यह असली टोकन नहीं है', 'Sahi token number paane ke liye login karein aur business ka QR scan karein.': 'असली टोकन नंबर पाने के लिए लॉग इन करें और बिज़नेस का QR स्कैन करें।', 'Aksar pooche jaane wale sawal': 'अक्सर पूछे जाने वाले सवाल', 'Profile': 'प्रोफ़ाइल', 'Business': 'बिज़नेस', 'Mere Tokens': 'मेरे टोकन', 'Scan': 'स्कैन', 'Language': 'भाषा', 'Refresh': 'रिफ़्रेश', 'Awaaz': 'आवाज़', 'Chalu': 'चालू', 'Band': 'बंद', 'Logout': 'लॉग आउट', 'Account delete karein': 'खाता हटाएँ', 'Guide (Madad)': 'गाइड (मदद)', 'Naam badlein': 'नाम बदलें', 'Save karein': 'सेव करें', 'Wapas': 'वापस', 'Pichla': 'पिछला', 'Agla': 'अगला', 'Dobara shuru karein': 'दोबारा शुरू करें', 'Jahan chhoda tha wahan se': 'जहाँ छोड़ा था वहाँ से', 'History dekhein': 'इतिहास देखें', 'Settings badlein': 'सेटिंग बदलें', 'Delete karein': 'हटाएँ', 'Print karein / PDF': 'प्रिंट करें / PDF', 'Image save karein': 'इमेज सेव करें', 'Page khul nahi paya. Kripya refresh karein.': 'पेज नहीं खुला। कृपया रिफ़्रेश करें।', 'Refresh karein': 'रिफ़्रेश करें', 'ABHI CHAL RAHA HAI': 'अभी चल रहा है', 'Abhi kisi ko nahi bulaya': 'अभी किसी को नहीं बुलाया', 'Abhi koi intezar me nahi': 'अभी कोई इंतज़ार में नहीं', 'Customer QR scan karke judenge.': 'ग्राहक QR स्कैन करके जुड़ेंगे।', 'SCAN KARKE TOKEN LEIN': 'स्कैन करके टोकन लें', 'QR dikhao / print': 'QR दिखाएँ / प्रिंट', 'Walk-in add karein': 'वॉक-इन जोड़ें', 'Aaj ka kaam khatam karein?': 'आज का काम खत्म करें?', 'Din khatam karein': 'दिन खत्म करें', 'Line chalu karein': 'लाइन चालू करें', 'Line rok dein': 'लाइन रोक दें', 'Number nikal gaya (Skip)': 'नंबर छोड़ दें', 'Koi limit nahi': 'कोई सीमा नहीं', 'Aage badhein': 'आगे बढ़ें', 'Queue banayein': 'कतार बनाएँ', 'Agla token {n} se shuru hoga': 'अगला टोकन {n} से शुरू होगा',
  },
};

const reverseWords: Record<string,string> = Object.fromEntries(Object.values(words).flatMap(map => Object.entries(map)).map(([source,target]) => [target,source]));
const ignoredLocaleSelector='script,style,input,textarea,[contenteditable="true"],.legal-body,.owner-current-name,.person-row,[data-user-content],[data-keep-language]';
function translate(locale: Locale, root: Node = document.body) {
  const dictionary = locale === 'hi-Latn' ? {} : words[locale];
  const lookup = (value: string) => {
    const lead=value.match(/^\s*/)?.[0]??'',trail=value.match(/\s*$/)?.[0]??'',clean=value.trim();
    const original=reverseWords[clean]??clean;let result=locale==='hi-Latn'?original:dictionary[original];
    const startNumber=original.match(/^Agla token (\d+) se shuru hoga$/)?.[1];
    if(startNumber&&locale==='en')result=`Next token starts at ${startNumber}`;
    if(startNumber&&locale==='hi-Deva')result=`अगला टोकन ${startNumber} से शुरू होगा`;
    return result?`${lead}${result}${trail}`:value;
  };
  const translateText=(node:Node)=>{const element=node.parentElement;if(element?.closest(ignoredLocaleSelector))return;const value=node.nodeValue;if(value){const next=lookup(value);if(next!==value)node.nodeValue=next}};
  if(root.nodeType===Node.TEXT_NODE){translateText(root);return}
  const rootElement=root instanceof Element?root:null;
  if(rootElement?.closest(ignoredLocaleSelector))return;
  const translateAttributes=(element:Element)=>{if(element.closest(ignoredLocaleSelector))return;for(const attr of ['aria-label','placeholder','title']){const value=element.getAttribute(attr);if(value){const next=lookup(value);if(next!==value)element.setAttribute(attr,next)}}};
  if(rootElement)translateAttributes(rootElement);
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node:Node|null;while((node=walker.nextNode()))translateText(node);
  if(rootElement?.querySelectorAll)rootElement.querySelectorAll<HTMLElement>('[aria-label],[placeholder],[title]').forEach(translateAttributes);
}

export function LocaleRuntime() {
  useEffect(() => {
    let activeLocale:Locale='hi-Latn';let frame=0;const pending=new Set<Node>();
    const apply=()=>{
      const cookie=document.cookie.split('; ').find(item=>item.startsWith('tokenapp-language='))?.split('=')[1];
      const stored=localStorage.getItem('tokenapp-language')||cookie;
      const locale:Locale=stored==='en'||stored==='hi-Deva'||stored==='hi-Latn'?stored:'hi-Latn';
      if(stored)localStorage.setItem('tokenapp-language',locale);
      document.documentElement.lang=locale==='hi-Deva'?'hi':locale;
      if(locale!==activeLocale){activeLocale=locale;translate(locale)}
    };
    apply();
    const flush=()=>{frame=0;const nodes=[...pending];pending.clear();for(const node of nodes)if(node.isConnected)translate(activeLocale,node)};
    const observer=new MutationObserver(records=>{
      for(const record of records){
        if(record.type==='childList')record.addedNodes.forEach(node=>pending.add(node));
        else if(record.type==='characterData'&&record.target.nodeType===Node.TEXT_NODE)pending.add(record.target);
        else if(record.type==='attributes')pending.add(record.target);
      }
      if(pending.size&&!frame)frame=requestAnimationFrame(flush);
    });
    observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder','title']});
    window.addEventListener('tokenapp-language-change',apply);
    return()=>{observer.disconnect();window.removeEventListener('tokenapp-language-change',apply);if(frame)cancelAnimationFrame(frame);pending.clear()};
  },[]);
  return null;
}
