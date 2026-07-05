export type CookieConsent = {
  version: 1;
  essential: true;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export type CookiePreferences = Pick<
  CookieConsent,
  "preferences" | "analytics" | "marketing"
>;
