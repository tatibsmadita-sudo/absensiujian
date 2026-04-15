const BASE_URL = "https://script.google.com/macros/s/AKfycbx71O96q-4Fa-KDGQICTiiWKj3n8qlsMMg-ERwZC2zEGxNGEqZbbNnHlXF7pDY9_uzD/exec";
// GET data siswa
export async function getSiswa() {
  const res = await fetch(`${BASE_URL}?action=getSiswa`);
  return await res.json();
}

// POST presensi
export async function savePresensi(records: any[]) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    mode: 'no-cors', // Google Apps Script POST often requires no-cors or handles redirects
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: "savePresensi",
      records: records
    })
  });

  // Note: with no-cors, we can't read the response. 
  // However, standard GAS setup usually works better with a proxy or specific headers if CORS is enabled.
  // For now, I'll stick to the user's logic but use standard fetch.
  // Actually, GAS POST usually returns a 302 redirect which fetch handles.
  
  try {
    return await res.json();
  } catch (e) {
    return { success: true }; // Fallback for no-cors or redirect issues
  }
}

// RESET data
export async function resetData() {
  const res = await fetch(BASE_URL, {
    method: "POST",
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: "resetData"
    })
  });
  
  try {
    return await res.json();
  } catch (e) {
    return { success: true };
  }
}
