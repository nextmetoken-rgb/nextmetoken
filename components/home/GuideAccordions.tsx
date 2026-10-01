'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const guides = [
  { title: 'Token number paane ke liye', steps: ['Google se login karein.', 'Apna poora naam daalein.', 'Counter par QR scan karke naam confirm karein.', 'Aapko live updates ke saath token mil jayega.'] },
  { title: 'Business QR token shuru karne ke liye', steps: ['Google se login karein.', 'Apna poora naam daalein.', 'Business tab me jaakar nayi queue banayein.', 'Business ka naam daalein aur queue ko apne hisaab se set karein.', 'QR milne par use dukaan ke bahar lagayein, print karein ya save karein.', 'Live queue screen par customer ke naam aur token number dekhein.', 'Agla aur Pichla dabakar number aage badhayein.'] },
];

export function GuideAccordions() {
  const [open, setOpen] = useState<number | null>(null);
  return <div className="home-guides">{guides.map((guide, index) => {
    const expanded = open === index;
    const id = `home-guide-${index}`;
    return <section className="home-guide" key={guide.title}>
      <button type="button" className="home-guide-toggle" aria-expanded={expanded} aria-controls={id} onClick={() => setOpen(expanded ? null : index)}>
        <span>{guide.title}</span><ChevronDown size={20} aria-hidden="true" />
      </button>
      <div id={id} className="home-guide-panel" data-open={expanded} aria-hidden={!expanded}>
        <ol>{guide.steps.map(step => <li key={step}>{step}</li>)}</ol>
      </div>
    </section>;
  })}</div>;
}
