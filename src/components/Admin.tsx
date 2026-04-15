import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  FileText, 
  Download, 
  Trash2, 
  Edit, 
  Plus,
  Search,
  FileDown,
  Upload,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { getSiswa, resetData } from '@/src/services/api';
import { Siswa } from '@/src/types';

const MOCK_USERS = [
  { id: '1', username: 'Admin', namaGuru: 'Administrator', role: 'admin' },
  { id: '2', username: 'guru1', namaGuru: 'Siti Aminah, S.Pd', role: 'guru' },
];

export default function Admin({ user }: { user: any }) {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form States
  const [newSiswa, setNewSiswa] = useState({ noUrut: '', nama: '', kelas: '', noUjian: '', ruang: '' });
  const [newUser, setNewUser] = useState({ namaGuru: '', username: '', pass: '', role: 'guru' });
  const [isSiswaDialogOpen, setIsSiswaDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);

  useEffect(() => {
    fetchSiswa();
  }, []);

  const fetchSiswa = async () => {
    try {
      setLoading(true);
      const data = await getSiswa();
      setSiswa(data);
    } catch (error) {
      console.error('Error fetching siswa:', error);
      toast.error('Gagal mengambil data siswa');
    } finally {
      setLoading(false);
    }
  };

  const handleResetData = async () => {
    if (window.confirm('PERINGATAN: Ini akan menghapus SELURUH data siswa dan presensi di server. Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin?')) {
      try {
        setResetting(true);
        await resetData();
        setSiswa([]);
        toast.success('Seluruh data berhasil direset');
      } catch (error) {
        console.error('Error resetting data:', error);
        toast.error('Gagal mereset data');
      } finally {
        setResetting(false);
      }
    }
  };

  const handleDeleteSiswa = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
      setSiswa(siswa.filter(s => s.id !== id));
      toast.success('Data siswa berhasil dihapus');
    }
  };

  const handleTambahSiswa = () => {
    if (!newSiswa.nama || !newSiswa.noUjian) {
      toast.error('Nama dan No Ujian wajib diisi');
      return;
    }
    const id = Math.random().toString(36).substr(2, 9);
    setSiswa([...siswa, { 
      id, 
      noUrut: parseInt(newSiswa.noUrut) || siswa.length + 1, 
      nama: newSiswa.nama,
      kelas: newSiswa.kelas,
      nomorUjian: newSiswa.noUjian,
      ruang: newSiswa.ruang
    }]);
    setNewSiswa({ noUrut: '', nama: '', kelas: '', noUjian: '', ruang: '' });
    setIsSiswaDialogOpen(false);
    toast.success('Siswa berhasil ditambahkan (Lokal)');
  };

  const handleTambahUser = () => {
    if (!newUser.username || !newUser.namaGuru) {
      toast.error('Username dan Nama Guru wajib diisi');
      return;
    }
    const id = Math.random().toString(36).substr(2, 9);
    setUsers([...users, { ...newUser, id }]);
    setNewUser({ namaGuru: '', username: '', pass: '', role: 'guru' });
    setIsUserDialogOpen(false);
    toast.success('User berhasil ditambahkan');
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const newSiswaList: Siswa[] = [];
      
      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const [no, nama, kelas, noUjian, ruang] = line.split(',');
        if (nama && noUjian) {
          newSiswaList.push({
            id: Math.random().toString(36).substr(2, 9),
            noUrut: parseInt(no) || i,
            nama: nama.trim(),
            kelas: kelas?.trim() || '',
            nomorUjian: noUjian?.trim() || '',
            ruang: ruang?.trim() || ''
          });
        }
      }

      if (newSiswaList.length > 0) {
        setSiswa([...siswa, ...newSiswaList]);
        toast.success(`${newSiswaList.length} data siswa berhasil diimport`);
      } else {
        toast.error('Format file tidak sesuai atau data kosong');
      }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const headers = "No,Nama,Kelas,No Ujian,Ruang\n1,Contoh Nama,XII IPA 1,01-001-001,Ruang 01";
    const blob = new Blob([headers], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'template_siswa_smadita.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Template CSV berhasil diunduh');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Memuat data admin...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Halaman Admin</h2>
          <p className="text-slate-500 mt-1">Kelola data siswa, user, dan laporan kehadiran.</p>
        </div>
      </div>

      <Tabs defaultValue="siswa" className="w-full">
        <TabsList className="bg-white border p-1 rounded-xl mb-6">
          <TabsTrigger value="siswa" className="rounded-lg px-6">Manajemen Siswa</TabsTrigger>
          <TabsTrigger value="users" className="rounded-lg px-6">Manajemen User</TabsTrigger>
          <TabsTrigger value="import" className="rounded-lg px-6">Import Data</TabsTrigger>
        </TabsList>

        <TabsContent value="siswa">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Daftar Siswa</CardTitle>
                <CardDescription>Total {siswa.length} siswa terdaftar.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleResetData}
                  disabled={resetting}
                >
                  {resetting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                  Reset Data
                </Button>
                <Dialog open={isSiswaDialogOpen} onOpenChange={setIsSiswaDialogOpen}>
                  <DialogTrigger
                    nativeButton={true}
                    render={
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Siswa
                      </Button>
                    }
                  />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Siswa Baru</DialogTitle>
                    <DialogDescription>Isi formulir di bawah untuk menambahkan siswa.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="no" className="text-right">No Urut</Label>
                      <Input id="no" type="number" className="col-span-3" value={newSiswa.noUrut} onChange={e => setNewSiswa({...newSiswa, noUrut: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nama" className="text-right">Nama</Label>
                      <Input id="nama" className="col-span-3" value={newSiswa.nama} onChange={e => setNewSiswa({...newSiswa, nama: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="kelas" className="text-right">Kelas</Label>
                      <Input id="kelas" className="col-span-3" value={newSiswa.kelas} onChange={e => setNewSiswa({...newSiswa, kelas: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="noUjian" className="text-right">No Ujian</Label>
                      <Input id="noUjian" className="col-span-3" value={newSiswa.noUjian} onChange={e => setNewSiswa({...newSiswa, noUjian: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="ruang" className="text-right">Ruang</Label>
                      <Input id="ruang" className="col-span-3" value={newSiswa.ruang} onChange={e => setNewSiswa({...newSiswa, ruang: e.target.value})} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleTambahSiswa}>Simpan</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Cari nama atau nomor ujian..." 
                    className="pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>No Ujian</TableHead>
                    <TableHead>Ruang</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {siswa.filter(s => s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || s.nomorUjian.includes(searchTerm)).map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.noUrut}</TableCell>
                      <TableCell className="font-medium">{s.nama}</TableCell>
                      <TableCell>{s.kelas}</TableCell>
                      <TableCell>{s.nomorUjian}</TableCell>
                      <TableCell>{s.ruang}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteSiswa(s.id || '')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Manajemen User (Guru)</CardTitle>
                <CardDescription>Kelola akun guru yang dapat melakukan presensi.</CardDescription>
              </div>
              <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                <DialogTrigger
                  nativeButton={true}
                  render={
                    <Button size="sm" className="bg-slate-800 hover:bg-slate-900 text-white">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Tambah User
                    </Button>
                  }
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah User Baru</DialogTitle>
                    <DialogDescription>Buat akun baru untuk guru atau admin.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="namaGuru" className="text-right">Nama Guru</Label>
                      <Input id="namaGuru" className="col-span-3" value={newUser.namaGuru} onChange={e => setNewUser({...newUser, namaGuru: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">Username</Label>
                      <Input id="username" className="col-span-3" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="pass" className="text-right">Password</Label>
                      <Input id="pass" type="password" className="col-span-3" value={newUser.pass} onChange={e => setNewUser({...newUser, pass: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">Role</Label>
                      <Select value={newUser.role} onValueChange={val => setNewUser({...newUser, role: val})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Pilih Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="guru">Guru</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleTambahUser}>Simpan User</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Nama Guru</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-mono">{u.username}</TableCell>
                      <TableCell>{u.namaGuru}</TableCell>
                      <TableCell className="capitalize">{u.role}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => setUsers(users.filter(usr => usr.id !== u.id))}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Import Data Siswa</CardTitle>
                <CardDescription>Unggah file CSV atau hubungkan dengan Google Sheets.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="w-4 h-4 mr-2" />
                Download Template CSV
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-12 border-2 border-dashed rounded-xl border-slate-200">
              <Upload className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-600 font-medium">Klik untuk unggah atau seret file ke sini</p>
              <p className="text-slate-400 text-sm mt-1">Format: .csv (Gunakan template yang disediakan)</p>
              <div className="mt-6">
                <Input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  id="csv-upload" 
                  onChange={handleImportCSV}
                />
                <Button variant="outline" nativeButton={false} render={<label htmlFor="csv-upload" className="cursor-pointer" />}>
                  Pilih File CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
