import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock,
  TrendingUp,
  FileDown,
  Eye,
  ChevronDown,
  ChevronUp,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Mock Data for Dashboard
const MOCK_STATS = [
  { ruang: 'Ruang 01', hadir: 18, sakit: 1, izin: 1, alfa: 0, total: 20 },
  { ruang: 'Ruang 02', hadir: 15, sakit: 2, izin: 0, alfa: 3, total: 20 },
  { ruang: 'Ruang 03', hadir: 20, sakit: 0, izin: 0, alfa: 0, total: 20 },
  { ruang: 'Ruang 04', hadir: 12, sakit: 1, izin: 2, alfa: 5, total: 20 },
  { ruang: 'Ruang 05', hadir: 19, sakit: 0, izin: 1, alfa: 0, total: 20 },
];

// Mock Student Attendance Details
const MOCK_STUDENT_DETAILS: Record<string, any[]> = {
  'Ruang 01': [
    { nama: 'Ahmad Fauzi', status: 'Hadir' },
    { nama: 'Siti Aminah', status: 'Sakit' },
    { nama: 'Budi Santoso', status: 'Izin' },
  ],
  'Ruang 02': [
    { nama: 'Citra Lestari', status: 'Alfa' },
    { nama: 'Dedi Kurniawan', status: 'Alfa' },
    { nama: 'Eka Putri', status: 'Alfa' },
    { nama: 'Fajar Siddiq', status: 'Sakit' },
    { nama: 'Gita Gutawa', status: 'Sakit' },
  ],
  // ... add more if needed
};

const COLORS = {
  hadir: '#22c55e',
  sakit: '#eab308',
  izin: '#3b82f6',
  alfa: '#ef4444'
};

export default function Dashboard() {
  const [stats] = useState(MOCK_STATS);
  const [expandedRuang, setExpandedRuang] = useState<string | null>(null);
  const [selectedRuangPDF, setSelectedRuangPDF] = useState('Ruang 01');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const totals = stats.reduce((acc, curr) => ({
    hadir: acc.hadir + curr.hadir,
    sakit: acc.sakit + curr.sakit,
    izin: acc.izin + curr.izin,
    alfa: acc.alfa + curr.alfa,
    total: acc.total + curr.total
  }), { hadir: 0, sakit: 0, izin: 0, alfa: 0, total: 0 });

  const summaryCards = [
    { label: 'Total Siswa', value: totals.total, icon: Users, color: 'text-slate-600', bg: 'bg-slate-100' },
    { label: 'Hadir', value: totals.hadir, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Sakit', value: totals.sakit, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Izin', value: totals.izin, icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Alfa', value: totals.alfa, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const generatePDF = (ruang: string) => {
    const doc = new jsPDF() as any;
    const roomData = stats.find(s => s.ruang === ruang);
    const formattedDate = format(new Date(selectedDate), 'dd MMMM yyyy', { locale: id });
    
    // Header
    doc.setFontSize(18);
    doc.text('LAPORAN MEL UJIAN', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('SMA DIPONEGORO TUMPANG (SMADITA)', 105, 28, { align: 'center' });
    doc.line(20, 32, 190, 32);

    // Info
    doc.setFontSize(10);
    doc.text(`Tanggal: ${formattedDate}`, 20, 40);
    doc.text(`Ruangan: ${ruang}`, 20, 45);
    doc.text(`Ringkasan: H(${roomData?.hadir}) S(${roomData?.sakit}) I(${roomData?.izin}) A(${roomData?.alfa})`, 20, 50);

    // Table
    const students = MOCK_STUDENT_DETAILS[ruang] || [];
    const tableData = students.map((s, i) => [i + 1, s.nama, s.status]);
    
    autoTable(doc, {
      startY: 60,
      head: [['No', 'Nama Siswa', 'Status Kehadiran']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    });

    // Signature
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.text('Mengetahui,', 150, finalY);
    doc.text('Kepala Sekolah', 150, finalY + 5);
    doc.text('( ........................ )', 150, finalY + 25);

    doc.save(`Laporan_Presensi_${ruang.replace(' ', '_')}_${selectedDate}.pdf`);
    toast.success(`Laporan PDF ${ruang} tanggal ${formattedDate} berhasil diunduh`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Presensi Peserta Ujian</h2>
          <p className="text-slate-500 mt-1">
            Ringkasan kehadiran siswa pada tanggal <span className="font-semibold text-blue-600">{format(new Date(selectedDate), 'dd MMMM yyyy', { locale: id })}</span>.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border shadow-sm">
            <CalendarIcon className="w-4 h-4 text-slate-400 ml-2" />
            <Input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-none shadow-none focus-visible:ring-0 w-[160px] cursor-pointer"
            />
          </div>

          {/* PDF Export */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border shadow-sm">
            <Select value={selectedRuangPDF} onValueChange={setSelectedRuangPDF}>
              <SelectTrigger className="w-[140px] border-none shadow-none focus:ring-0">
                <SelectValue placeholder="Pilih Ruang" />
              </SelectTrigger>
              <SelectContent>
                {stats.map(s => (
                  <SelectItem key={s.ruang} value={s.ruang}>{s.ruang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => generatePDF(selectedRuangPDF)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bg} p-2 rounded-lg`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors" />
              </div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{card.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Statistik per Ruangan</CardTitle>
            <CardDescription>Grafik perbandingan status kehadiran di setiap ruangan.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="ruang" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="hadir" stackId="a" fill={COLORS.hadir} radius={[0, 0, 0, 0]} />
                <Bar dataKey="sakit" stackId="a" fill={COLORS.sakit} />
                <Bar dataKey="izin" stackId="a" fill={COLORS.izin} />
                <Bar dataKey="alfa" stackId="a" fill={COLORS.alfa} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Table Summary */}
        <Card className="border-none shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Detail Ruangan</CardTitle>
            <CardDescription>Klik ruangan untuk melihat daftar siswa Sakit/Izin/Alfa.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Ruang</TableHead>
                  <TableHead className="text-right pr-6">H/S/I/A</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((row) => (
                  <React.Fragment key={row.ruang}>
                    <TableRow 
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => setExpandedRuang(expandedRuang === row.ruang ? null : row.ruang)}
                    >
                      <TableCell className="font-medium pl-6">
                        <div className="flex items-center gap-2">
                          {expandedRuang === row.ruang ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          {row.ruang}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100">{row.hadir}</Badge>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-100">{row.sakit}</Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">{row.izin}</Badge>
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-100">{row.alfa}</Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRuang === row.ruang && (
                      <TableRow className="bg-slate-50/50">
                        <TableCell colSpan={2} className="p-4">
                          <div className="space-y-3">
                            {['Sakit', 'Izin', 'Alfa'].map(status => {
                              const students = (MOCK_STUDENT_DETAILS[row.ruang] || []).filter(s => s.status === status);
                              if (students.length === 0) return null;
                              return (
                                <div key={status} className="bg-white p-3 rounded-lg border shadow-sm">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-2 h-2 rounded-full ${status === 'Sakit' ? 'bg-yellow-500' : status === 'Izin' ? 'bg-blue-500' : 'bg-red-500'}`} />
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{status} ({students.length})</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {students.map((s, i) => (
                                      <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-700 font-normal">
                                        {s.nama}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                            {(!MOCK_STUDENT_DETAILS[row.ruang] || MOCK_STUDENT_DETAILS[row.ruang].filter(s => s.status !== 'Hadir').length === 0) && (
                              <div className="text-center py-4 text-slate-400 text-sm italic">
                                Tidak ada siswa Sakit, Izin, atau Alfa di ruangan ini.
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
