class I18n {
  constructor() {
    this.translations = {};
    this.currentLang = 'en';
    this.loadTranslations(this.currentLang);
  }

  async loadTranslations(lang) {
    try {
      const module = await import(`./locales/${lang}.i18n.json`);
      this.translations = module.default || module;
      this.currentLang = lang;
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
      const fallbackModule = await import('./locales/en.i18n.json');
      this.translations = fallbackModule.default || fallbackModule;
    }
  }

  t(key, params = null) {
    let translation = this.translations[key] || key;

    if (params) {
      Object.keys(params).forEach((param) => {
        translation = translation.replace(
          new RegExp(`{{${param}}}`, 'g'),
          params[param]
        );
      });
    }

    return translation;
  }

  changeLanguage(lang) {
    this.loadTranslations(lang);
  }

  getCurrentLang() {
    return this.currentLang;
  }
}

const i18n = new I18n();

export default i18n;
