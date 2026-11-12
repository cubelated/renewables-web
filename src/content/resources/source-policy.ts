// Exact reviewed hosts, including public authorities and the actual issuing organizations.
const hosts = new Set([
  "www.kdei-taipei.org", "www.immigration.gov.tw", "coa.immigration.gov.tw", "fw.wda.gov.tw",
  "www.boca.gov.tw", "www.meco.org.tw", "tteo.thaiembassy.org", "sorong.imigrasi.go.id",
  "goldcard.nat.gov.tw", "www.nhi.gov.tw", "www.mohw.gov.tw", "www.gov.tw",
  "siminternasional.korlantas.polri.go.id", "ezworktaiwan.wda.gov.tw", "english.mol.gov.tw",
  "laws.mol.gov.tw", "service.ctbcbank.com", "pip.moi.gov.tw", "www.tamsui.land.ntpc.gov.tw",
  "www.ris.gov.tw", "ielts.org", "www.ets.org", "tocfl.edu.tw", "dcert.csie.ncku.edu.tw",
  "www.cdc.gov.tw", "i33.npa.gov.tw", "polri.go.id",
  "statdb.mol.gov.tw", "www.mol.gov.tw", "english.moe.gov.tw", "www.gov.uk",
  "www.international.gc.ca", "www.canada.ca", "australia.org.tw", "www.passports.gov.au",
  "www.passports.govt.nz", "api.ireland.ie", "www.immd.gov.hk", "www.gov.mo",
  "www.kln.gov.my", "www.koryu.or.jp", "www.india.org.tw", "taipei.diplo.de",
  "taipei.mfa.gov.sg", "vnoffice-taipei.mofa.gov.vn", "www.ait.org.tw", "travel.state.gov",
  "www.mofa.go.kr", "www.gov.za", "www.diplomatie.gouv.fr", "www.mofa.gov.mm", "www.gov.sz",
  "www.fbi.gov", "www.rcmp.ca", "www.police.uk", "www.justice.govt.nz", "www.garda.ie",
  "www.saps.gov.za", "www.meco-labor.org.tw",
]);

// Some authorities use query-based article URLs. Permit only these exact reviewed destinations.
const queryUrls = new Set([
  "https://laws.mol.gov.tw/Eng/PrintFLAWDAT0201.aspx?beginpos=5&id=FL015128",
  "https://ezworktaiwan.wda.gov.tw/cp.aspx?n=511766BD9E956242&s=35F4766BC4662D87",
  "https://service.ctbcbank.com/FAQ/Page01?kmid=4739",
  "https://service.ctbcbank.com/FAQ/Page01?kmid=4785",
  "https://www.tamsui.land.ntpc.gov.tw/cp.aspx?n=14322",
  "https://ezworktaiwan.wda.gov.tw/cp.aspx?n=CA9809B5A6623B21",
  "https://ezworktaiwan.wda.gov.tw/cp.aspx?Create=1&n=CA9809B5A6623B21&s=90774906111B0527",
  "https://www.international.gc.ca/country-pays/taiwan/taipei-info.aspx?lang=eng",
  "https://www.india.org.tw/eoi.php?id=important-guidelines",
]);

export function isOfficialUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.port && !url.hash && hosts.has(url.hostname) && (!url.search || queryUrls.has(value));
  } catch { return false; }
}
