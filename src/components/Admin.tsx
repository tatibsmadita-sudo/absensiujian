import React, { useState } from 'react';
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
  ShieldAlert
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

// Mock Data
const MOCK_SISWA = [
  { id: '1', noUrut: 1, nama: 'Ahmad Fauzi', kelas: 'XII IPA 1', nomorUjian: '01-001-001', ruang: 'Ruang 01' },
  { id: '2', noUrut: 2, nama: 'Budi Santoso', kelas: 'XII IPA 1', nomorUjian: '01-001-002', ruang: 'Ruang 01' },
  { id: '3', noUrut: 3, nama: 'Citra Lestari', kelas: 'XII IPA 1', nomorUjian: '01-001-003', ruang: 'Ruang 01' },
];

const MOCK_USERS = [
  { id: '1', username: 'Admin', namaGuru: 'Administrator', role: 'admin' },
  { id: '2', username: 'guru1', namaGuru: 'Siti Aminah, S.Pd', role: 'guru' },
];

export default function Admin({ user }: { user: any }) {
  const [siswa, setSiswa] = useState(MOCK_SISWA);
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteSiswa = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
      setSiswa(siswa.filter(s => s.id !== id));
      toast.success('Data siswa berhasil dihapus');
    }
  };

  const downloadTemplate = () => {
    const headers = "No,Nama,Kelas,No Ujian,Ruang\n";
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
              <Dialog>
                <DialogTrigger
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
                      <Input id="no" type="number" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nama" className="text-right">Nama</Label>
                      <Input id="nama" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="kelas" className="text-right">Kelas</Label>
                      <Input id="kelas" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="noUjian" className="text-right">No Ujian</Label>
                      <Input id="noUjian" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="ruang" className="text-right">Ruang</Label>
                      <Input id="ruang" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={() => toast.success('Fitur simulasi: Siswa ditambahkan')}>Simpan</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                  {siswa.map((s) => (
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
                            onClick={() => handleDeleteSiswa(s.id)}
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
              <Dialog>
                <DialogTrigger
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
                      <Input id="namaGuru" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">Username</Label>
                      <Input id="username" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="pass" className="text-right">Password</Label>
                      <Input id="pass" type="password" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">Role</Label>
                      <Select defaultValue="guru">
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
                    <Button type="submit" onClick={() => toast.success('Fitur simulasi: User ditambahkan')}>Simpan User</Button>
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
                        <Button variant="ghost" size="icon" className="text-red-600">
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
              <Button variant="outline" className="mt-6">
                Pilih File
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
