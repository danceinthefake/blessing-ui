// Indonesian label pack. Its type asks for every word of every component with a `labels` prop, so
// a new English word without an Indonesian one fails the typecheck.
import type BlessAnnotator from "../components/BlessAnnotator.vue";
import type BlessAudioRecorder from "../components/BlessAudioRecorder.vue";
import type BlessAvatarGroup from "../components/BlessAvatarGroup.vue";
import type BlessBarChart from "../components/BlessBarChart.vue";
import type BlessCalendar from "../components/BlessCalendar.vue";
import type BlessCameraCapture from "../components/BlessCameraCapture.vue";
import type BlessCardInput from "../components/BlessCardInput.vue";
import type BlessCoachmark from "../components/BlessCoachmark.vue";
import type BlessCodeBlock from "../components/BlessCodeBlock.vue";
import type BlessCommand from "../components/BlessCommand.vue";
import type BlessConnectionStatus from "../components/BlessConnectionStatus.vue";
import type BlessCopyButton from "../components/BlessCopyButton.vue";
import type BlessCronInput from "../components/BlessCronInput.vue";
import type BlessCropper from "../components/BlessCropper.vue";
import type BlessDataTable from "../components/BlessDataTable.vue";
import type BlessDataView from "../components/BlessDataView.vue";
import type BlessDateTimePicker from "../components/BlessDateTimePicker.vue";
import type BlessDurationInput from "../components/BlessDurationInput.vue";
import type BlessEditor from "../components/BlessEditor.vue";
import type BlessEmojiPicker from "../components/BlessEmojiPicker.vue";
import type BlessFormula from "../components/BlessFormula.vue";
import type BlessFunnel from "../components/BlessFunnel.vue";
import type BlessGantt from "../components/BlessGantt.vue";
import type BlessInfiniteCanvas from "../components/BlessInfiniteCanvas.vue";
import type BlessInputNumber from "../components/BlessInputNumber.vue";
import type BlessKanban from "../components/BlessKanban.vue";
import type BlessKeyValueEditor from "../components/BlessKeyValueEditor.vue";
import type BlessLogViewer from "../components/BlessLogViewer.vue";
import type BlessMarquee from "../components/BlessMarquee.vue";
import type BlessNodeGraph from "../components/BlessNodeGraph.vue";
import type BlessNotificationInbox from "../components/BlessNotificationInbox.vue";
import type BlessOnboardingChecklist from "../components/BlessOnboardingChecklist.vue";
import type BlessOrderList from "../components/BlessOrderList.vue";
import type BlessPhoneInput from "../components/BlessPhoneInput.vue";
import type BlessPickList from "../components/BlessPickList.vue";
import type BlessPinPad from "../components/BlessPinPad.vue";
import type BlessPoll from "../components/BlessPoll.vue";
import type BlessQueryBuilder from "../components/BlessQueryBuilder.vue";
import type BlessQuestionnaire from "../components/BlessQuestionnaire.vue";
import type BlessRangeCalendar from "../components/BlessRangeCalendar.vue";
import type BlessReadMore from "../components/BlessReadMore.vue";
import type BlessSankey from "../components/BlessSankey.vue";
import type BlessScheduler from "../components/BlessScheduler.vue";
import type BlessShortcutRecorder from "../components/BlessShortcutRecorder.vue";
import type BlessSliderCaptcha from "../components/BlessSliderCaptcha.vue";
import type BlessSortable from "../components/BlessSortable.vue";
import type BlessStat from "../components/BlessStat.vue";
import type BlessStepper from "../components/BlessStepper.vue";
import type BlessSwipeDeck from "../components/BlessSwipeDeck.vue";
import type BlessThread from "../components/BlessThread.vue";
import type BlessTimer from "../components/BlessTimer.vue";
import type BlessTour from "../components/BlessTour.vue";
import type BlessTreemap from "../components/BlessTreemap.vue";
import type BlessTypingIndicator from "../components/BlessTypingIndicator.vue";
import type BlessUploader from "../components/BlessUploader.vue";
import type BlessUptimeBar from "../components/BlessUptimeBar.vue";

/** every word of one component: its `labels` prop, with no key left out */
type All<C> = C extends new (...a: never[]) => { $props: { labels?: infer L } }
  ? Required<NonNullable<L>>
  : C extends (props: infer P, ...a: never[]) => unknown
    ? Required<NonNullable<P extends { labels?: infer L } ? L : never>>
    : never;

/** a pack with every word of the library; use it as the type of your own complete pack */
export type BlessLabelsFull = {
  BlessAnnotator: All<typeof BlessAnnotator>;
  BlessAudioRecorder: All<typeof BlessAudioRecorder>;
  BlessAvatarGroup: All<typeof BlessAvatarGroup>;
  BlessBarChart: All<typeof BlessBarChart>;
  BlessCalendar: All<typeof BlessCalendar>;
  BlessCameraCapture: All<typeof BlessCameraCapture>;
  BlessCardInput: All<typeof BlessCardInput>;
  BlessCoachmark: All<typeof BlessCoachmark>;
  BlessCodeBlock: All<typeof BlessCodeBlock>;
  BlessCommand: All<typeof BlessCommand>;
  BlessConnectionStatus: All<typeof BlessConnectionStatus>;
  BlessCopyButton: All<typeof BlessCopyButton>;
  BlessCronInput: All<typeof BlessCronInput>;
  BlessCropper: All<typeof BlessCropper>;
  BlessDataTable: All<typeof BlessDataTable>;
  BlessDataView: All<typeof BlessDataView>;
  BlessDateTimePicker: All<typeof BlessDateTimePicker>;
  BlessDurationInput: All<typeof BlessDurationInput>;
  BlessEditor: All<typeof BlessEditor>;
  BlessEmojiPicker: All<typeof BlessEmojiPicker>;
  BlessFormula: All<typeof BlessFormula>;
  BlessFunnel: All<typeof BlessFunnel>;
  BlessGantt: All<typeof BlessGantt>;
  BlessInfiniteCanvas: All<typeof BlessInfiniteCanvas>;
  BlessInputNumber: All<typeof BlessInputNumber>;
  BlessKanban: All<typeof BlessKanban>;
  BlessKeyValueEditor: All<typeof BlessKeyValueEditor>;
  BlessLogViewer: All<typeof BlessLogViewer>;
  BlessMarquee: All<typeof BlessMarquee>;
  BlessNodeGraph: All<typeof BlessNodeGraph>;
  BlessNotificationInbox: All<typeof BlessNotificationInbox>;
  BlessOnboardingChecklist: All<typeof BlessOnboardingChecklist>;
  BlessOrderList: All<typeof BlessOrderList>;
  BlessPhoneInput: All<typeof BlessPhoneInput>;
  BlessPickList: All<typeof BlessPickList>;
  BlessPinPad: All<typeof BlessPinPad>;
  BlessPoll: All<typeof BlessPoll>;
  BlessQueryBuilder: All<typeof BlessQueryBuilder>;
  BlessQuestionnaire: All<typeof BlessQuestionnaire>;
  BlessRangeCalendar: All<typeof BlessRangeCalendar>;
  BlessReadMore: All<typeof BlessReadMore>;
  BlessSankey: All<typeof BlessSankey>;
  BlessScheduler: All<typeof BlessScheduler>;
  BlessShortcutRecorder: All<typeof BlessShortcutRecorder>;
  BlessSliderCaptcha: All<typeof BlessSliderCaptcha>;
  BlessSortable: All<typeof BlessSortable>;
  BlessStat: All<typeof BlessStat>;
  BlessStepper: All<typeof BlessStepper>;
  BlessSwipeDeck: All<typeof BlessSwipeDeck>;
  BlessThread: All<typeof BlessThread>;
  BlessTimer: All<typeof BlessTimer>;
  BlessTour: All<typeof BlessTour>;
  BlessTreemap: All<typeof BlessTreemap>;
  BlessTypingIndicator: All<typeof BlessTypingIndicator>;
  BlessUploader: All<typeof BlessUploader>;
  BlessUptimeBar: All<typeof BlessUptimeBar>;
};

const copy = { copy: "Salin", copied: "Tersalin", copiedLive: "Disalin ke papan klip" };
const month = { prev: "Bulan sebelumnya", next: "Bulan berikutnya" };
const unknown = (what: string, name: string, suggestion?: string) =>
  `${what} “${name}” tidak dikenal${suggestion ? `. Maksud Anda “${suggestion}”?` : ""}`;

/** Bahasa Indonesia for every component: `provideLabels(labelsId)` */
export const labelsId: BlessLabelsFull = {
  BlessAnnotator: {
    tools: "Alat",
    select: "Pilih",
    box: "Kotak",
    pin: "Penanda",
    add: "Tambah di tengah",
    remove: "Hapus",
    name: "Nama",
    regions: "Tanda",
    regionName: (k, n, l) => `${k === "box" ? "Kotak" : "Penanda"} ${n}${l ? `: ${l}` : ""}`,
    added: (n) => `${n} ditambahkan`,
    removed: (n) => `${n} dihapus`,
    moved: (x, y) => `${x}% dari kiri, ${y}% dari atas`,
    hint: "Tombol panah menggeser tanda, Alt dengan panah mengubah ukuran kotak, Delete menghapusnya.",
  },
  BlessAudioRecorder: {
    record: "Rekam",
    pause: "Jeda",
    resume: "Lanjutkan",
    stop: "Berhenti",
    again: "Rekam lagi",
    recording: "Merekam",
    paused: "Dijeda",
    done: "Terekam",
    unavailable: "Mikrofon tidak tersedia",
  },
  BlessAvatarGroup: { more: (n) => `${n} lainnya` },
  BlessBarChart: { category: "Kategori" },
  BlessCalendar: month,
  BlessCameraCapture: {
    start: "Nyalakan kamera",
    capture: "Ambil foto",
    switch: "Ganti kamera",
    retake: "Ambil ulang",
    preview: "Pratinjau kamera",
    photo: "Foto",
    unavailable: "Kamera tidak tersedia",
  },
  BlessCardInput: { invalid: "Periksa nomor kartu" },
  BlessCoachmark: { dot: (t) => `Baru: ${t}`, ok: "Mengerti" },
  BlessCodeBlock: copy,
  BlessCommand: {
    recent: "Terakhir",
    scope: (l) => `Hanya di ${l}`,
    clearScope: "Cari di semua tempat",
    scopeHint: (parts) => `Ketik ${parts.join(", ")}`,
  },
  BlessConnectionStatus: {
    online: "Daring",
    back: "Kembali daring",
    connecting: "Menyambung ulang…",
    offline: "Anda sedang luring",
  },
  BlessCopyButton: copy,
  BlessCronInput: {
    minute: "Menit",
    hour: "Jam",
    day: "Tanggal",
    month: "Bulan",
    weekday: "Hari",
    next: "Jalan berikutnya",
    invalid: "Periksa bagian yang ditandai",
  },
  BlessCropper: {
    size: (w, h, x, y) => `${w} kali ${h} piksel, dari ${x}, ${y}`,
    hint: "panah menggeser, + − mengubah ukuran",
    rotateLeft: "Putar ke kiri",
    rotateRight: "Putar ke kanan",
    loadError: "Gambar tidak dapat dimuat.",
  },
  BlessDataTable: {
    selectPage: "Pilih halaman",
    rowsPerPage: "Baris per halaman",
    selectRow: (n) => `Pilih ${n}`,
    resize: (c) => `Ubah lebar ${c}`,
  },
  BlessDataView: { layout: "Tata letak", list: "Daftar", grid: "Kisi", empty: "Tidak ada item" },
  BlessDateTimePicker: { time: "Waktu" },
  // the parser reads h and m, so the example keeps them
  BlessDurationInput: { invalid: "Masukkan waktu seperti 1:30 atau 1h 30m" },
  BlessEditor: {
    bold: "Tebal",
    italic: "Miring",
    strike: "Coret",
    code: "Kode sebaris",
    h1: "Judul 1",
    h2: "Judul 2",
    h3: "Judul 3",
    bulletList: "Daftar berpoin",
    orderedList: "Daftar bernomor",
    blockquote: "Kutipan",
    codeBlock: "Blok kode",
    hr: "Garis pemisah",
    undo: "Urungkan",
    redo: "Ulangi",
  },
  // the emoji names stay English: pass `emojis` with Indonesian names to search in Indonesian
  BlessEmojiPicker: {
    search: "Cari emoji",
    groups: "Grup emoji",
    recent: "Terakhir",
    results: "Hasil",
    empty: "Emoji tidak ditemukan",
    smileys: "Wajah",
    people: "Orang",
    nature: "Hewan dan alam",
    food: "Makanan dan minuman",
    activities: "Aktivitas",
    travel: "Perjalanan dan tempat",
    objects: "Benda",
    symbols: "Simbol",
  },
  BlessFormula: {
    insert: "Sisipkan nilai",
    result: (v) => `= ${v}`,
    use: (n) => `Pakai “${n}”`,
    error: (e) => {
      switch (e.code) {
        case "unexpected":
          return e.name
            ? `“${e.name}” tidak terduga di posisi ${e.pos + 1}`
            : "Rumus berakhir terlalu cepat";
        case "unclosed":
          return "Ada kurung yang belum ditutup";
        case "unknown-variable":
          return unknown("Nilai", e.name ?? "", e.suggestion);
        case "unknown-function":
          return unknown("Fungsi", e.name ?? "", e.suggestion);
        case "arity":
          return `${e.name} memerlukan nilai untuk diolah`;
        case "divide-by-zero":
          return "Pembagian dengan nol";
        default:
          return "Hasilnya bukan angka";
      }
    },
  },
  BlessFunnel: {
    ofPrev: (n) => `${n}% dari langkah sebelumnya`,
    ofFirst: (n) => `${n}% dari awal`,
  },
  BlessGantt: {
    span: (t, a, b) => `${t}: ${a} sampai ${b}`,
    done: (p) => `${p}% selesai`,
    after: (names) => `setelah ${names.join(" dan ")}`,
  },
  BlessInfiniteCanvas: {
    zoomIn: "Perbesar",
    zoomOut: "Perkecil",
    reset: "Atur ulang tampilan",
    zoom: (p) => `Zoom ${p}%`,
    hint: "Tombol panah menggeser, plus dan minus mengubah zoom, 0 mengatur ulang.",
  },
  BlessInputNumber: { decrease: "Kurangi", increase: "Tambah" },
  BlessKanban: {
    card: (i, col) => `Pindahkan kartu ${i} di ${col}`,
    moved: (col, p, n) => `Dipindah ke ${col}, posisi ${p} dari ${n}`,
    position: (col, p, n) => `${col}, posisi ${p} dari ${n}`,
    dropped: (col, p) => `Diletakkan di ${col}, posisi ${p}`,
    full: (col) => `${col} sudah penuh`,
    grabbed:
      "Dipegang. Atas dan bawah memindahkannya di dalam kolom, kiri dan kanan ke kolom lain, Spasi meletakkannya, Escape membatalkan.",
    cancelled: "Dibatalkan, urutan dikembalikan",
    hint: "Tekan Spasi untuk memegang kartu. Atas dan bawah memindahkannya di dalam kolom, kiri dan kanan ke kolom lain. Spasi meletakkannya, Escape membatalkan.",
    roleDescription: "kartu yang dapat diurutkan",
  },
  BlessKeyValueEditor: {
    key: "Kunci",
    value: "Nilai",
    enabled: "Aktif",
    remove: "Hapus",
    duplicate: "Kunci ini dipakai lebih dari sekali",
  },
  BlessLogViewer: {
    filter: "Saring baris",
    follow: "Ikuti",
    empty: "Tidak ada baris",
    count: (shown, total) => `${shown} dari ${total} baris`,
  },
  BlessMarquee: { play: "Putar", pause: "Jeda" },
  BlessNodeGraph: {
    node: (l, to, from) =>
      l +
      (to.length ? `. Terhubung ke ${to.join(", ")}` : "") +
      (from.length ? `. Dihubungkan dari ${from.join(", ")}` : ""),
    linkFrom: (a) =>
      `Menghubungkan dari ${a}. Tombol panah memilih tujuan, Enter menghubungkan atau memutus, Escape membatalkan.`,
    linkTo: (a, b, exists) =>
      a === b
        ? `${a}: pilih simpul lain`
        : `${exists ? "Putuskan" : "Hubungkan"} ${a} ke ${b}? Enter`,
    linked: (a, b) => `${a} terhubung ke ${b}`,
    unlinked: (a, b) => `${a} terputus dari ${b}`,
    refused: (a, b, why) =>
      why === "cycle"
        ? `Tidak dihubungkan: ${b} sudah mengarah ke ${a}`
        : `Tidak dihubungkan: ${a} ke ${b}`,
    cancelled: "Dibatalkan",
    removed: (l) => `${l} dihapus`,
    hint: "Tombol panah menggeser simpul, L memulai tautan, Delete menghapusnya.",
  },
  BlessNotificationInbox: {
    title: "Notifikasi",
    bell: (n) => (n ? `Notifikasi, ${n} belum dibaca` : "Notifikasi"),
    readAll: "Tandai semua sudah dibaca",
    dismiss: "Tutup",
    empty: "Tidak ada notifikasi baru.",
    unread: "Belum dibaca",
  },
  BlessOnboardingChecklist: {
    progress: (d, n) => `${d} dari ${n} selesai`,
    complete: "Semua selesai. Kerja bagus.",
    dismiss: "Tutup",
  },
  BlessOrderList: {
    up: (p) => `Naikkan item ${p}`,
    down: (p) => `Turunkan item ${p}`,
    moved: (p, n) => `Dipindah ke posisi ${p} dari ${n}`,
  },
  BlessPhoneInput: { country: "Kode negara", number: "Nomor telepon" },
  BlessPickList: {
    moveSelected: (to) => `Pindahkan yang dipilih ke ${to}`,
    moveAll: (to) => `Pindahkan semua ke ${to}`,
    moved: (n, to) => `${n} dipindah ke ${to}`,
  },
  BlessPinPad: {
    pin: "PIN",
    entered: (n, l) => `${n} dari ${l} digit dimasukkan`,
    delete: "Hapus",
    clear: "Kosongkan",
  },
  BlessPoll: { vote: "Pilih", yours: "pilihan Anda", votes: (n) => `${n} suara` },
  BlessQueryBuilder: {
    group: "Aturan",
    match: "Cocokkan",
    all: "Semua aturan ini",
    any: "Salah satu aturan ini",
    field: "Kolom",
    op: "Operator",
    value: "Nilai",
    addRule: "Tambah aturan",
    addGroup: "Tambah grup",
    remove: "Hapus aturan",
    removeGroup: "Hapus grup",
    eq: "adalah",
    neq: "bukan",
    contains: "berisi",
    starts: "diawali",
    lt: "kurang dari",
    lte: "paling banyak",
    gt: "lebih dari",
    gte: "paling sedikit",
    empty: "kosong",
    notEmpty: "tidak kosong",
    before: "sebelum",
    onOrBefore: "pada atau sebelum",
    after: "sesudah",
    onOrAfter: "pada atau sesudah",
  },
  BlessQuestionnaire: {
    next: "Lanjut",
    previous: "Kembali",
    skip: "Lewati",
    submit: "Kirim",
    required: "Jawab dulu untuk melanjutkan.",
  },
  BlessRangeCalendar: {
    ...month,
    clear: "Hapus semua",
    summary: (d, b) => (d ? `${d} hari dalam ${b} blok` : "Belum ada hari yang dipilih"),
    selected: (d) => `${d} dipilih`,
    cleared: (d) => `${d} dihapus`,
    hint: "Tombol panah berpindah, Spasi memilih atau melepas hari, tahan Shift dan tekan panah untuk mewarnai, Page Up dan Page Down mengganti bulan.",
  },
  BlessReadMore: { more: "Baca selengkapnya", less: "Tampilkan lebih sedikit" },
  BlessSankey: { from: "Dari", to: "Ke", value: "Nilai" },
  BlessScheduler: {
    prev: "Sebelumnya",
    next: "Berikutnya",
    today: "Hari ini",
    add: "Tambah acara",
    remove: "Hapus",
    title: "Judul",
    newEvent: "Acara baru",
    eventName: (t, d, a, b) => `${t}, ${a}–${b}, ${d}`,
    moved: (t, d, a, b) => `${t}: ${d}, ${a} sampai ${b}`,
    added: (t) => `${t} ditambahkan`,
    removed: (t) => `${t} dihapus`,
    hint: "Tombol panah menggeser acara, Alt dengan atas atau bawah mengubah durasinya, Delete menghapusnya.",
  },
  BlessShortcutRecorder: {
    button: (l, c) => `${l}: ${c || "belum diatur"}. Tekan Enter untuk mengubah.`,
    pressKeys: "Tekan tombol…",
    recording: "Merekam. Tekan tombol yang Anda inginkan. Escape membatalkan, Backspace menghapus.",
    set: (c) => `Diatur ke ${c}`,
    needsModifier: (c) => `Tambahkan Ctrl, Alt, atau Meta ke ${c}`,
    usedBy: (c, by) => `${c} sudah dipakai oleh ${by}`,
    taken: (c) => `${c} sudah dipakai`,
  },
  BlessSliderCaptcha: { verified: "Terverifikasi", failed: "Belum pas, coba lagi" },
  BlessSortable: {
    grip: (i) => `Urutkan ulang item ${i}`,
    grabbed: (i, n) =>
      `Item ${i} dari ${n} dipegang. Tombol panah memindahkannya, Spasi meletakkannya, Escape membatalkan.`,
    moved: (p, n) => `Dipindah ke posisi ${p} dari ${n}`,
    sent: (l, p, n) => `Dipindah ke ${l}, posisi ${p} dari ${n}`,
    dropped: (p, n) => `Diletakkan di posisi ${p} dari ${n}`,
    cancelled: "Dibatalkan, urutan dikembalikan",
    hint: "Tekan Spasi untuk memegang, tombol panah untuk memindahkan, Spasi untuk meletakkan, Escape untuk membatalkan.",
    groupHint: "Alt dengan panah kiri atau kanan mengirimnya ke daftar lain.",
    roleDescription: "item yang dapat diurutkan",
  },
  BlessStat: { up: "Naik", down: "Turun", flat: "Tidak berubah" },
  BlessStepper: { next: "Lanjut", prev: "Kembali", finish: "Selesai" },
  BlessSwipeDeck: {
    accept: "Terima",
    reject: "Tolak",
    skip: "Lewati",
    undo: "Urungkan",
    empty: "Tidak ada kartu lagi",
  },
  BlessThread: { replies: (n) => `${n} balasan` },
  BlessTimer: {
    start: "Mulai",
    resume: "Lanjutkan",
    pause: "Jeda",
    reset: "Atur ulang",
    finished: "Selesai",
    round: (r, n) => `ronde ${r} dari ${n}`,
  },
  BlessTour: {
    next: "Lanjut",
    prev: "Kembali",
    done: "Selesai",
    skip: "Lewati",
    step: (n) => `Langkah ${n}`,
  },
  BlessTreemap: {
    tile: (l, v, s, n) => `${l}, ${v}, ${s}${n ? `, berisi ${n} item, Enter membuka` : ""}`,
    path: "Jalur",
    up: "Naik satu tingkat",
    hint: "Tombol panah berpindah antarpetak, Enter membuka atau memilih, Backspace naik satu tingkat.",
  },
  BlessTypingIndicator: {
    one: (n) => `${n} sedang mengetik…`,
    two: (a, b) => `${a} dan ${b} sedang mengetik…`,
    many: (n, more) => `${n} dan ${more} lainnya sedang mengetik…`,
  },
  BlessUploader: {
    clear: "Kosongkan",
    upload: "Unggah",
    tooLarge: "Terlalu besar",
    failed: "Gagal mengunggah",
    uploaded: (n) => `${n} terunggah`,
    failedFile: (n, why) => `${n}: ${why}`,
    cancel: (n) => `Batalkan ${n}`,
    remove: (n) => `Hapus ${n}`,
  },
  BlessUptimeBar: {
    summary: (p, n) => `Uptime ${p} selama ${n} periode`,
    up: "Normal",
    degraded: "Menurun",
    down: "Mati",
    none: "Tidak ada data",
  },
};
