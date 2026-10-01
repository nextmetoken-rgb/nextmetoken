'use client';

import { useEffect } from 'react';

type Locale = 'en' | 'hi-Deva';
const words: Record<Locale, Record<string, string>> = {
  en: {
    'Next Me Token': 'Next Me Token', 'Line ka jhanjhat khatam. Token QR se.': 'Skip the queue hassle. Get your token by QR.',
    'Customer ke liye QR token banayein, aur QR scan karke apna token number lein.': 'Create a QR token for your customers, or scan a QR code to get your number.',
    'Login karke shuru karein': 'Log in to get started', 'Google se continue karein': 'Continue with Google',
    'Shuru kaise karein': 'How to get started', 'Token number paane ke liye': 'Get a token number', 'Business QR token shuru karne ke liye': 'Start a business QR queue',
    'Google se login karein.': 'Log in with Google.', 'Apna poora naam daalein.': 'Enter your full name.', 'Counter par QR scan karke naam confirm karein.': 'Scan the counter QR code and confirm your name.', 'Aapko live updates ke saath token mil jayega.': 'Get your token with live updates.',
    'Business tab me jaakar nayi queue banayein.': 'Open the Business tab and create a queue.', 'Business ka naam daalein aur queue ko apne hisaab se set karein.': 'Enter your business name and set up the queue.', 'QR milne par use dukaan ke bahar lagayein, print karein ya save karein.': 'Display the QR at your shop, print it, or save it.', 'Live queue screen par customer ke naam aur token number dekhein.': 'See customer names and token numbers on the live queue screen.', 'Agla aur Pichla dabakar number aage badhayein.': 'Use Next and Previous to move the number.',
    'Kaun kaun use kar sakta hai': 'Who can use it', 'Clinic aur lab': 'Clinics and labs', 'Repair aur service center': 'Repair and service centers', 'Bank aur office counter': 'Bank and office counters', 'Mithai aur chai ki dukaan': 'Sweet and tea shops', 'Aur kai jagah': 'And many other places', 'Line ka jhanjhat? Wahan Next Me Token.': 'A queue hassle? Use Next Me Token there.',
    'Aksar pooche jaane wale sawal': 'Frequently asked questions', 'Terms': 'Terms', 'Privacy Policy': 'Privacy Policy', 'Profile': 'Profile', 'Business': 'Business', 'Mere Tokens': 'My Tokens', 'Scan': 'Scan', 'Language': 'Language', 'Notification': 'Notifications', 'Awaaz': 'Sound', 'Chalu': 'On', 'Band': 'Off', 'Logout': 'Log out', 'Account delete karein': 'Delete account', 'Guide (Madad)': 'Guide', 'Madad ke tips': 'Help tips', 'Naam badlein': 'Edit name', 'Save karein': 'Save', 'Wapas': 'Back', 'Pichla': 'Previous', 'Agla': 'Next', 'Dobara shuru karein': 'Start again', 'Jahan chhoda tha wahan se': 'Continue where you left off', 'History dekhein': 'View history', 'Settings badlein': 'Change settings', 'Delete karein': 'Delete', 'QR code': 'QR code', 'Print karein / PDF': 'Print / PDF', 'Image save karein': 'Save image', 'Page khul nahi paya. Kripya refresh karein.': 'Page could not be opened. Please refresh.', 'Refresh karein': 'Refresh',
  },
  'hi-Deva': {
    'Line ka jhanjhat khatam. Token QR se.': 'लाइन का झंझट खत्म। QR से टोकन लें।',
    'Customer ke liye QR token banayein, aur QR scan karke apna token number lein.': 'ग्राहक के लिए QR टोकन बनाएँ, या QR स्कैन करके अपना नंबर लें।',
    'Login karke shuru karein': 'लॉग इन करके शुरू करें', 'Google se continue karein': 'Google से जारी रखें',
    'Shuru kaise karein': 'शुरू कैसे करें', 'Token number paane ke liye': 'टोकन नंबर पाने के लिए', 'Business QR token shuru karne ke liye': 'बिज़नेस QR टोकन शुरू करने के लिए',
    'Google se login karein.': 'Google से लॉग इन करें।', 'Apna poora naam daalein.': 'अपना पूरा नाम डालें।', 'Counter par QR scan karke naam confirm karein.': 'काउंटर पर QR स्कैन करके नाम पक्का करें।', 'Aapko live updates ke saath token mil jayega.': 'लाइव अपडेट के साथ टोकन मिल जाएगा।',
    'Business tab me jaakar nayi queue banayein.': 'Business टैब में जाकर नई कतार बनाएँ।', 'Business ka naam daalein aur queue ko apne hisaab se set karein.': 'बिज़नेस का नाम डालें और कतार को अपने हिसाब से सेट करें।', 'QR milne par use dukaan ke bahar lagayein, print karein ya save karein.': 'QR मिलने पर उसे दुकान के बाहर लगाएँ, प्रिंट करें या सेव करें।', 'Live queue screen par customer ke naam aur token number dekhein.': 'लाइव कतार स्क्रीन पर ग्राहक का नाम और टोकन नंबर देखें।', 'Agla aur Pichla dabakar number aage badhayein.': 'अगला और पिछला दबाकर नंबर आगे बढ़ाएँ।',
    'Kaun kaun use kar sakta hai': 'कौन इसका इस्तेमाल कर सकता है', 'Clinic aur lab': 'क्लिनिक और लैब', 'Repair aur service center': 'मरम्मत और सर्विस सेंटर', 'Bank aur office counter': 'बैंक और ऑफिस काउंटर', 'Mithai aur chai ki dukaan': 'मिठाई और चाय की दुकान', 'Aur kai jagah': 'और कई जगह', 'Line ka jhanjhat? Wahan Next Me Token.': 'लाइन का झंझट? वहाँ Next Me Token।',
    'Aksar pooche jaane wale sawal': 'अक्सर पूछे जाने वाले सवाल', 'Profile': 'प्रोफ़ाइल', 'Business': 'बिज़नेस', 'Mere Tokens': 'मेरे टोकन', 'Scan': 'स्कैन', 'Language': 'भाषा', 'Notification': 'सूचनाएँ', 'Awaaz': 'आवाज़', 'Chalu': 'चालू', 'Band': 'बंद', 'Logout': 'लॉग आउट', 'Account delete karein': 'खाता हटाएँ', 'Guide (Madad)': 'गाइड (मदद)', 'Madad ke tips': 'मदद के सुझाव', 'Naam badlein': 'नाम बदलें', 'Save karein': 'सेव करें', 'Wapas': 'वापस', 'Pichla': 'पिछला', 'Agla': 'अगला', 'Dobara shuru karein': 'दोबारा शुरू करें', 'Jahan chhoda tha wahan se': 'जहाँ छोड़ा था वहाँ से', 'History dekhein': 'इतिहास देखें', 'Settings badlein': 'सेटिंग बदलें', 'Delete karein': 'हटाएँ', 'Print karein / PDF': 'प्रिंट करें / PDF', 'Image save karein': 'इमेज सेव करें', 'Page khul nahi paya. Kripya refresh karein.': 'पेज नहीं खुला। कृपया रिफ़्रेश करें।', 'Refresh karein': 'रिफ़्रेश करें',
  },
};

function translate(locale: Locale) {
  const dictionary = words[locale];
  const reverse = Object.fromEntries(Object.entries(dictionary).map(([source, target]) => [target, source]));
  const lookup = (value: string) => {
    const lead = value.match(/^\s*/)?.[0] ?? '';
    const trail = value.match(/\s*$/)?.[0] ?? '';
    const clean = value.trim();
    const original = reverse[clean] ?? clean;
    const result = dictionary[original];
    return result ? `${lead}${result}${trail}` : value;
  };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest('script,style,.legal-body,[data-keep-language]')) continue;
    const value = node.nodeValue;
    if (value) { const translated = lookup(value); if (translated !== value) node.nodeValue = translated; }
  }
  document.querySelectorAll<HTMLElement>('[aria-label],[placeholder],[title]').forEach(element => {
    for (const attr of ['aria-label', 'placeholder', 'title']) {
      const value = element.getAttribute(attr);
      if (value) { const translated = lookup(value); if (translated !== value) element.setAttribute(attr, translated); }
    }
  });
}

export function LocaleRuntime() {
  useEffect(() => {
    const apply = () => {
      const cookie = document.cookie.split('; ').find(item => item.startsWith('tokenapp-language='))?.split('=')[1];
      const locale = (localStorage.getItem('tokenapp-language') || cookie) as Locale | null;
      if (locale) localStorage.setItem('tokenapp-language', locale);
      document.documentElement.lang = locale === 'hi-Deva' ? 'hi' : locale === 'en' ? 'en' : 'hi-Latn';
      if (locale === 'en' || locale === 'hi-Deva') translate(locale);
    };
    apply();
    const observer = new MutationObserver(() => { if (localStorage.getItem('tokenapp-language') === 'en') translate('en'); if (localStorage.getItem('tokenapp-language') === 'hi-Deva') translate('hi-Deva'); });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'placeholder', 'title'] });
    window.addEventListener('tokenapp-language-change', apply);
    return () => { observer.disconnect(); window.removeEventListener('tokenapp-language-change', apply); };
  }, []);
  return null;
}
