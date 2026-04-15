import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Login({ onLogin, onCancel }: { onLogin: (user: any) => void, onCancel: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock Login Logic
    setTimeout(() => {
      setIsLoading(false);
      if (username === 'Admin' && password === 'adminsmadita') {
        onLogin({ username: 'Admin', role: 'admin' });
      } else if (username === 'guru1' && password === 'guru123') {
        onLogin({ username: 'guru1', role: 'guru' });
      } else {
        toast.error('Username atau Password salah!');
      }
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-2xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-center text-white">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <p className="text-blue-100 text-sm mt-1">Silakan masuk untuk mengelola aplikasi.</p>
        </div>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="username" 
                  placeholder="Masukkan username" 
                  className="pl-10 h-12 rounded-xl"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Masukkan password" 
                  className="pl-10 h-12 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Masuk Sekarang'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="bg-slate-50 p-4 flex justify-center border-t">
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-slate-500">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
