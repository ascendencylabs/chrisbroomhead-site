// Partner and channel slots for hidden streams.
//
// BLOODWORK_PROVIDERS: UK private blood-testing services shown on /bloodwork.
// `url` is the provider's ordinary homepage. When Chris opens an affiliate
// account, paste the tracked link into `affiliateUrl`; the page switches to it
// and adds the required "affiliate link" disclosure automatically.
// Listing a provider is not a claim about its prices or panels: Chris confirms
// the list before /bloodwork is launched (see streams.ts).

export interface BloodworkProvider {
  name: string;
  url: string;
  affiliateUrl: string;
}

export const BLOODWORK_PROVIDERS: BloodworkProvider[] = [
  { name: 'Medichecks', url: 'https://www.medichecks.com', affiliateUrl: '' },
  { name: 'Thriva', url: 'https://thriva.co', affiliateUrl: '' },
  { name: 'Forth', url: 'https://www.forthwithlife.co.uk', affiliateUrl: '' },
  { name: 'Randox Health', url: 'https://randoxhealth.com', affiliateUrl: '' },
  { name: 'London Medical Laboratory', url: 'https://www.londonmedicallaboratory.com', affiliateUrl: '' },
];

// Media channels come from src/config/socials.ts (verified + showOnSite).
