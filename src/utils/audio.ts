"use client";

export function playTestVoice(onComplete?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onComplete?.();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance("Awaaz chalu ho gayi");
  utterance.lang = "hi-IN";
  utterance.rate = 1.0;
  utterance.onend = () => onComplete?.();
  utterance.onerror = () => onComplete?.();

  window.speechSynthesis.speak(utterance);
}

export function announceTokenNumber(number: number) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(`Token number ${number}`);
  utterance.lang = "hi-IN";
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
}

export function announceYourTurn(businessName: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(`Aapki baari hai, ${businessName}`);
  utterance.lang = "hi-IN";
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}
