declare module '@embeddedchat/i18n' {
  class I18n {
    translations: Record<string, any>;
    currentLang: string;

    constructor();

    loadTranslations(lang: string): void;
    t(key: string): string;
    changeLanguage(lang: string): void;
    getCurrentLang(): string;
  }

  const i18n: I18n;

  export default i18n;
}
