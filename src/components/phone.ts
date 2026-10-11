export interface BlessCountry {
  /** ISO 3166 region code, for example `ID` */
  code: string;
  /** calling code without the plus, for example `62` */
  dial: string;
}

/** The longest phone number E.164 allows, in digits (country code included). */
export const E164_MAX = 15;

const D = (code: string, dial: string): BlessCountry => ({ code, dial });
export const COUNTRIES: BlessCountry[] = [
  D("US", "1"), D("CA", "1"), D("GB", "44"), D("IE", "353"), D("DE", "49"), D("FR", "33"),
  D("ES", "34"), D("PT", "351"), D("IT", "39"), D("NL", "31"), D("BE", "32"), D("CH", "41"),
  D("AT", "43"), D("SE", "46"), D("NO", "47"), D("DK", "45"), D("FI", "358"), D("PL", "48"),
  D("TR", "90"), D("AE", "971"), D("SA", "966"), D("EG", "20"), D("ZA", "27"), D("NG", "234"),
  D("KE", "254"), D("IN", "91"), D("PK", "92"), D("BD", "880"), D("ID", "62"), D("MY", "60"),
  D("SG", "65"), D("TH", "66"), D("VN", "84"), D("PH", "63"), D("CN", "86"), D("HK", "852"),
  D("TW", "886"), D("JP", "81"), D("KR", "82"), D("AU", "61"), D("NZ", "64"), D("BR", "55"),
  D("MX", "52"), D("AR", "54"), D("CL", "56"), D("CO", "57"),
]; // prettier-ignore

/** Digits only, without the trunk zero that people type before a national number. */
export const nationalDigits = (input: string, dial: string): string =>
  input
    .replace(/\D/g, "")
    .replace(/^0/, "")
    .slice(0, E164_MAX - dial.length);

/** `+` then the calling code then the national digits. Empty when there are no national digits. */
export const joinPhone = (dial: string, national: string): string =>
  national ? `+${dial}${national}` : "";

/**
 * Splits `+628123456789` into a country and national digits. The longest calling code wins.
 * When two countries share a code (US and CA), `prefer` picks between them.
 */
export function splitPhone(
  value: string,
  countries: BlessCountry[],
  prefer?: string,
): { country: BlessCountry; national: string } | null {
  const d = value.replace(/\D/g, "");
  if (!value.startsWith("+") || !d) return null;
  const hits = countries.filter((c) => d.startsWith(c.dial));
  if (!hits.length) return null;
  const longest = Math.max(...hits.map((c) => c.dial.length));
  const best = hits.filter((c) => c.dial.length === longest);
  const country = best.find((c) => c.code === prefer) ?? best[0];
  return { country, national: d.slice(country.dial.length) };
}
