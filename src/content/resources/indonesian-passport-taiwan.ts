import type { ResourceGuide } from "./types";

export const indonesianPassportTaiwan: ResourceGuide = {
  id: "id-passport-tw",
  slug: "indonesian-passport-renewal-taiwan",
  nationalities: { kind: "only", codes: ["ID"] },
  residences: ["TW"], document: "passport",
  authority: { name: "Kantor Dagang dan Ekonomi Indonesia (KDEI) Taipei", sourceId: "kdei-appointment" },
  primarySourceId: "kdei-appointment",
  updatedOn: "2026-11-12", reviewedOn: "2026-11-12", editorialStatus: "published",
  keywords: ["KDEI", "perpanjang paspor Indonesia di Taiwan", "KDEI Taipei perpanjangan paspor", "台灣印尼護照換發"],
  sources: [
    {
      id: "kdei-appointment", title: "Pendaftaran Antrean Paspor Online", organization: "KDEI Taipei",
      url: "https://www.kdei-taipei.org/paspor", checkedOn: "2026-11-12", access: "official-index",
      claims: ["Online appointment", "Common preparation documents", "Special cases", "Appointment attendance", "Service location"],
      note: "Official indexed text reviewed; direct automated access returned HTTP 403. Confirm the live instructions before booking or paying.",
    },
    {
      id: "kdei-digital", title: "Tata Cara Pendaftaran & Pembayaran Digital Paspor", organization: "KDEI Taipei",
      url: "https://www.kdei-taipei.org/pages/tata-cara-pendaftaran--pembayaran-digital-paspor-49.html",
      checkedOn: "2026-11-12", updatedOn: "2026-04-08", access: "official-index",
      claims: ["Newer digital registration/payment notice exists"],
      note: "Notice title and date reviewed in the official index. The attachment was not verified; no payment mechanics are reproduced here.",
    },
    {
      id: "kdei-requirements", title: "Pelayanan Paspor Republik Indonesia", organization: "KDEI Taipei",
      url: "https://www.kdei-taipei.org/pages/pelayanan-paspor-republik-indonesia-35.html",
      checkedOn: "2026-11-12", access: "unavailable", claims: [],
      note: "HTTP 403 during review. Retained as the supplied official reference; not used to substantiate instructions.",
    },
    {
      id: "kdei-procedure", title: "Prosedur Pelayanan Keimigrasian Paspor", organization: "KDEI Taipei",
      url: "https://www.kdei-taipei.org/pages/prosedur-pelayanan-keimigrasian-paspor-10.html",
      checkedOn: "2026-11-12", access: "unavailable", claims: [],
      note: "HTTP 403 during review. Ask KDEI for the current procedure if this page cannot be opened.",
    },
  ],
  translationReviews: { en: "2026-11-12", "id-ID": "2026-11-12" },
  translations: {
    en: {
      title: "Indonesian Passport Renewal or Replacement in Taiwan",
      summary: "Start with KDEI Taipei for an Indonesian passport replacement: appointment information, preparation documents, and cases that need confirmation.",
      scope: "For Indonesian citizens residing in Taiwan. This is a preparation guide for ordinary replacement, with special cases signposted separately. It does not determine eligibility or extend Taiwan residence permission.",
      beforeYouStart: [
        { text: "Check whether your case is ordinary replacement, loss, damage, or a child's application with KDEI before booking.", sourceIds: ["kdei-appointment"] },
        { text: "Confirm the current registration and payment instructions. KDEI has a newer digital-payment notice; its attachment could not be verified in this review.", sourceIds: ["kdei-digital"] },
      ],
      commonRequirements: [
        { text: "Prepare the existing passport and ARC, each with an A4 photocopy.", sourceIds: ["kdei-appointment"] },
        { text: "Prepare the application form and payment documentation requested by the current official service.", sourceIds: ["kdei-appointment"] },
      ],
      conditionalRequirements: [
        { text: "Lost passports, children, and family/dependent circumstances have additional requirements. Confirm the case-specific list with KDEI; ordinary replacement documents are insufficient for every case.", sourceIds: ["kdei-appointment"] },
      ],
      suggestions: [
        "Keep your booking confirmation and document copies together. Review the spelling of your name on the replacement passport before using it.",
        "Track passport and ARC expiry dates separately. Replacing a passport does not renew an ARC.",
      ],
      steps: [
        { text: "Read the official appointment page, select an available date and time, and retain the booking proof.", sourceIds: ["kdei-appointment"] },
        { text: "Bring the required originals, copies, and booking proof at the assigned time. Confirm the current venue in your booking; the page lists KDEI Taipei, 6F, No. 550, Ruiguang Road, Neihu District, Taipei.", sourceIds: ["kdei-appointment"] },
        { text: "Ask KDEI to confirm the payment and collection arrangements for your application.", sourceIds: ["kdei-digital"] },
      ],
      importantNotes: [
        { text: "Source access was limited to official indexed text. Older official notices give different processing estimates. No fixed fee, completion time, or eligibility window is stated here; confirm these directly with KDEI.", sourceIds: ["kdei-appointment", "kdei-digital"] },
      ],
    },
    "id-ID": {
      title: "Perpanjangan atau Penggantian Paspor Indonesia di Taiwan",
      summary: "Mulai dari KDEI Taipei untuk penggantian paspor Indonesia: informasi antrean, persiapan berkas, dan kondisi yang perlu dikonfirmasi.",
      scope: "Untuk WNI yang tinggal di Taiwan. Panduan persiapan penggantian biasa ini memisahkan kasus khusus. Panduan ini tidak menentukan kelayakan atau memperpanjang izin tinggal Taiwan.",
      beforeYouStart: [
        { text: "Konfirmasikan kepada KDEI apakah permohonan Anda termasuk penggantian biasa, hilang, rusak, atau permohonan anak sebelum mendaftar.", sourceIds: ["kdei-appointment"] },
        { text: "Periksa petunjuk pendaftaran dan pembayaran terbaru. Ada pengumuman pembayaran digital KDEI yang lebih baru; lampirannya belum berhasil diverifikasi dalam peninjauan ini.", sourceIds: ["kdei-digital"] },
      ],
      commonRequirements: [
        { text: "Siapkan paspor lama dan ARC, masing-masing dengan fotokopi ukuran A4.", sourceIds: ["kdei-appointment"] },
        { text: "Siapkan formulir permohonan dan bukti pembayaran sesuai petunjuk layanan resmi terkini.", sourceIds: ["kdei-appointment"] },
      ],
      conditionalRequirements: [
        { text: "Paspor hilang, permohonan anak, serta kondisi keluarga atau dependent memiliki persyaratan tambahan. Konfirmasikan daftar sesuai kasus Anda kepada KDEI.", sourceIds: ["kdei-appointment"] },
      ],
      suggestions: ["Simpan bukti antrean bersama salinan berkas. Periksa ejaan nama pada paspor baru.", "Catat masa berlaku paspor dan ARC secara terpisah. Penggantian paspor tidak memperpanjang ARC."],
      steps: [
        { text: "Baca halaman antrean resmi, pilih tanggal dan jam yang tersedia, lalu simpan bukti booking.", sourceIds: ["kdei-appointment"] },
        { text: "Bawa dokumen asli, fotokopi, dan bukti booking pada waktu yang ditetapkan. Konfirmasikan lokasi pada booking; halaman mencantumkan KDEI Taipei, 6F, No. 550, Ruiguang Road, Neihu District, Taipei.", sourceIds: ["kdei-appointment"] },
        { text: "Konfirmasikan tata cara pembayaran dan pengambilan paspor kepada KDEI.", sourceIds: ["kdei-digital"] },
      ],
      importantNotes: [
        { text: "Peninjauan terbatas pada teks situs resmi yang terindeks. Perkiraan waktu proses dalam pengumuman lama berbeda. Biaya, waktu selesai, dan periode kelayakan tidak dicantumkan; konfirmasikan langsung kepada KDEI.", sourceIds: ["kdei-appointment", "kdei-digital"] },
      ],
    },
  },
};
