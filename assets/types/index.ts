export interface Country {
  name: string;
  capital: string;
  altSpellings: string;
  region: string;
  subregion: string;
  demonym: string;
  area: number;
  timezones: string;
  borders: string;
  nativeName: string;
  currencies: [
    {
      name: string;
      symbol: string;
    }
  ];
  languages: [
    {
      name: string;
      nativeName: string;
    }
  ];
  translations: {
    de: string;
    es: string;
    fr: string;
    ja: string;
    fa: string;
  };
  flag: '';
}
