// The browsers do not agree on the decimals of each currency: Firefox gives IDR two decimals,
// while Chromium and Node give none. A server render and the browser then disagree, and hydration
// fails. So the decimals are fixed here, after the current CLDR data. Other currencies use 2.
const ZERO = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "IDR",
  "ISK",
  "JPY",
  "KMF",
  "KRW",
  "PYG",
  "RWF",
  "UGX",
  "UYI",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);
const THREE = new Set(["BHD", "IQD", "JOD", "KWD", "LYD", "OMR", "TND"]);

export const currencyDigits = (currency: string) => {
  const c = currency.toUpperCase();
  return ZERO.has(c) ? 0 : THREE.has(c) ? 3 : 2;
};

/** `Intl.NumberFormat` for money, with the same decimals in every browser and on the server. */
export function moneyFormat(
  locale: string | undefined,
  currency: string,
  options: Intl.NumberFormatOptions = {},
) {
  const d = currencyDigits(currency);
  const max = options.maximumFractionDigits ?? d;
  return new Intl.NumberFormat(locale, {
    ...options,
    style: "currency",
    currency,
    minimumFractionDigits: Math.min(options.minimumFractionDigits ?? d, max),
    maximumFractionDigits: max,
  });
}
