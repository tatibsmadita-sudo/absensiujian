export interface Siswa {
  id?: string;
  noUrut: number;
  nama: string;
  kelas: string;
  nomorUjian: string;
  ruang: string;
}

export interface Presensi {
  id?: string;
  siswaId: string;
  nama: string;
  status: 'Hadir' | 'Sakit' | 'Izin' | 'Alfa';
  tanggal: string; // YYYY-MM-DD
  ruang: string;
  timestamp: string;
}

export interface UserProfile {
  id?: string;
  username: string;
  namaGuru: string;
  role: 'admin' | 'guru';
}

export type PresenceStats = {
  ruang: string;
  hadir: number;
  sakit: number;
  izin: number;
  alfa: number;
  total: number;
};
