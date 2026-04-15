import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  Save, 
  UserCheck,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

// Mock Data
const MOCK_SISWA = [
  { id: '1', noUrut: 1, nama: 'Ahmad Fauzi', kelas: 'XII IPA 1', nomorUjian: '01-001-001', ruang: 'Ruang 01' },
  { id: '2', noUrut: 2, nama: 'Budi Santoso', kelas: 'XII IPA 1', nomorUjian: '01-001-002', ruang: 'Ruang 01' },
  { id: '3', noUrut: 3, nama: 'Citra Lestari', kelas: 'XII IPA 1', nomorUjian: '01-001-003', ruang: 'Ruang 01' },
  { id: '4', noUrut: 4, nama: 'Dedi Kurniawan', kelas: 'XII IPA 1', nomorUjian: '01-001-004', ruang: 'Ruang 01' },
  { id: '5', noUrut: 5, nama: 'Eka Putri', kelas: 'XII IPA 1', nomorUjian: '01-001-005', ruang: 'Ruang 01' },
];

const RUANGAN = ['Ruang 01', 'Ruang 02', 'Ruang 03', 'Ruang 04', 'Ruang 05'];

export default function Presensi({ user }: { user: any }) {
  const [selectedRuang, setSelectedRuang] = useState('Ruang 01');
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = (siswaId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [siswaId]: status }));
  };

  const handleSelectAllHadir = () => {
    const newAttendance = { ...attendance };
    MOCK_SISWA.forEach(siswa => {
      newAttendance[siswa.id] = 'Hadir';
    });
    setAttendance(newAttendance);
    toast.success('Semua siswa diatur sebagai Hadir');
  };

  const handleSubmit = async () => {
    const unselected = MOCK_SISWA.filter(s => !attendance[s.id]);
    if (unselected.length > 0) {
      toast.error(`Masih ada ${unselected.length} siswa yang belum diabsen.`);
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Data presensi berhasil disimpan!');
      console.log('Submitted Attendance:', {
        ruang: selectedRuang,
        data: attendance,
        timestamp: new Date().toISOString()
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Input Presensi</h2>
          <p className="text-slate-500 mt-1">Silakan pilih ruangan dan isi kehadiran siswa.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedRuang} onValueChange={setSelectedRuang}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Pilih Ruangan" />
            </SelectTrigger>
            <SelectContent>
              {RUANGAN.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleSelectAllHadir} className="hidden md:flex">
            <UserCheck className="w-4 h-4 mr-2" />
            Set Semua Hadir
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Siswa - {selectedRuang}</CardTitle>
              <CardDescription>Menampilkan {MOCK_SISWA.length} siswa.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSelectAllHadir} className="md:hidden">
              Set Hadir
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[80px]">No</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead className="hidden md:table-cell">Nomor Ujian</TableHead>
                  <TableHead className="text-center">Status Kehadiran</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_SISWA.map((siswa) => (
                  <TableRow key={siswa.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-500">{siswa.noUrut}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-slate-900">{siswa.nama}</p>
                        <p className="text-xs text-slate-500 md:hidden">{siswa.nomorUjian}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-600 font-mono text-sm">
                      {siswa.nomorUjian}
                    </TableCell>
                    <TableCell>
                      <RadioGroup 
                        value={attendance[siswa.id]} 
                        onValueChange={(val) => handleStatusChange(siswa.id, val)}
                        className="flex justify-center gap-2 md:gap-6"
                      >
                        {[
                          { val: 'Hadir', label: 'H', color: 'text-green-600', border: 'border-green-200' },
                          { val: 'Sakit', label: 'S', color: 'text-yellow-600', border: 'border-yellow-200' },
                          { val: 'Izin', label: 'I', color: 'text-blue-600', border: 'border-blue-200' },
                          { val: 'Alfa', label: 'A', color: 'text-red-600', border: 'border-red-200' },
                        ].map((status) => (
                          <div key={status.val} className="flex flex-col items-center gap-1">
                            <RadioGroupItem 
                              value={status.val} 
                              id={`${siswa.id}-${status.val}`}
                              className="sr-only"
                            />
                            <Label
                              htmlFor={`${siswa.id}-${status.val}`}
                              className={`
                                w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border-2 cursor-pointer transition-all
                                ${attendance[siswa.id] === status.val 
                                  ? `bg-white ${status.border} shadow-sm scale-110 ring-2 ring-offset-1 ${status.val === 'Hadir' ? 'ring-green-500' : status.val === 'Sakit' ? 'ring-yellow-500' : status.val === 'Izin' ? 'ring-blue-500' : 'ring-red-500'}` 
                                  : 'bg-slate-50 border-transparent text-slate-400 hover:bg-white hover:border-slate-200'}
                              `}
                            >
                              <span className={`font-bold text-sm md:text-base ${attendance[siswa.id] === status.val ? status.color : ''}`}>
                                {status.label}
                              </span>
                            </Label>
                            <span className="text-[10px] font-medium text-slate-400 hidden md:block">{status.val}</span>
                          </div>
                        ))}
                      </RadioGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button 
          size="lg" 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl shadow-lg shadow-blue-200"
        >
          {isSubmitting ? (
            <>
              <Save className="w-5 h-5 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Submit Presensi
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
