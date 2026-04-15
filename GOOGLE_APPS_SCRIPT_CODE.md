# Google Apps Script Implementation

Jika Anda ingin menggunakan Google Apps Script secara langsung di Google Sheets, berikut adalah kode yang diperlukan.

## 1. Struktur Google Sheets
Buat spreadsheet baru dengan 3 sheet:
- **Siswa**: Kolom `No Urut`, `Nama`, `Kelas`, `Nomor Ujian`, `Ruang`
- **Presensi**: Kolom `Timestamp`, `Siswa ID`, `Nama`, `Status`, `Tanggal`, `Ruang`
- **User**: Kolom `Username`, `Password`, `Nama Guru`, `Role`

## 2. Code.gs
```javascript
function doGet(e) {
  var page = e.parameter.p || 'dashboard';
  return HtmlService.createTemplateFromFile(page)
    .evaluate()
    .setTitle('Presensi Smadita')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getSiswaByRuang(ruang) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Siswa');
  var data = sheet.getDataRange().getValues();
  var headers = data.shift();
  
  return data.filter(r => r[4] == ruang).map(r => {
    return {
      noUrut: r[0],
      nama: r[1],
      kelas: r[2],
      nomorUjian: r[3],
      ruang: r[4]
    };
  });
}

function savePresensi(attendanceData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Presensi');
  var now = new Date();
  
  attendanceData.forEach(item => {
    sheet.appendRow([
      now,
      item.siswaId,
      item.nama,
      item.status,
      item.tanggal,
      item.ruang
    ]);
  });
  return true;
}

function loginAdmin(username, password) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('User');
  var data = sheet.getDataRange().getValues();
  data.shift();
  
  var user = data.find(r => r[0] == username && r[1] == password);
  if (user) {
    return { username: user[0], namaGuru: user[2], role: user[3] };
  }
  return null;
}

function generatePDFReport(ruang, tanggal) {
  // Logika generate PDF menggunakan Google Docs Template atau HTML
  var html = "<h1>Laporan Presensi</h1><p>Ruang: " + ruang + "</p>";
  var blob = Utilities.newBlob(html, 'text/html', 'laporan.html');
  var pdf = blob.getAs('application/pdf');
  return Utilities.base64Encode(pdf.getBytes());
}
```

## 3. dashboard.html
```html
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body>
    <div class="container mt-4">
      <h2>Dashboard Statistik</h2>
      <div id="stats">Memuat data...</div>
    </div>
    <script>
      // Panggil google.script.run untuk ambil data
    </script>
  </body>
</html>
```

*(Catatan: Kode di atas adalah kerangka dasar. Untuk aplikasi lengkap yang berjalan di Cloud Run ini, silakan gunakan versi React yang telah saya bangun.)*
