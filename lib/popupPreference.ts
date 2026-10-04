const POPUP_PREFERENCE_KEY = 'tokenapp-popup-messages';

export function savePopupPreference(enabled: boolean) {
  localStorage.setItem(POPUP_PREFERENCE_KEY, String(enabled));
  window.dispatchEvent(new Event('tokenapp-popup-preference-change'));
}

export function popupPreferenceEnabled() {
  return localStorage.getItem(POPUP_PREFERENCE_KEY) === 'true';
}
