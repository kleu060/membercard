'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, User, Chrome, Facebook } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthFormProps {
  onSuccess?: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const { language, t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess?.();
      } else {
        setError(data.error || t('auth.loginFailed'));
      }
    } catch (error) {
      setError(t('auth.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess?.();
      } else {
        setError(data.error || t('auth.registrationFailed'));
      }
    } catch (error) {
      setError(t('auth.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // Implement Google OAuth flow
    alert('Google OAuth integration would be implemented here');
  };

  const handleFacebookLogin = async () => {
    // Implement Facebook OAuth flow
    alert('Facebook OAuth integration would be implemented here');
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          {t('auth.welcome')}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {t('auth.subtitle')}
        </p>
      </div>

      <Card>
        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
            <TabsTrigger value="register">{t('auth.register')}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <CardHeader>
              <CardTitle>{t('auth.loginAccount')}</CardTitle>
              <CardDescription>
                {t('auth.loginDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('auth.loggingIn') : t('auth.login')}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">{t('auth.or')}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                  >
                    <Chrome className="mr-2 h-4 w-4" />
                    {t('auth.loginWithGoogle')}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleFacebookLogin}
                  >
                    <Facebook className="mr-2 h-4 w-4" />
                    {t('auth.loginWithFacebook')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="register">
            <CardHeader>
              <CardTitle>{t('auth.createAccount')}</CardTitle>
              <CardDescription>
                {t('auth.createDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('auth.name')}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder={language === 'zh-TW' ? '您的姓名' : language === 'zh-CN' ? '您的姓名' : 'Your Name'}
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password">{t('auth.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t('auth.confirmPassword')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('auth.registering') : t('auth.register')}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">{t('auth.or')}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                  >
                    <Chrome className="mr-2 h-4 w-4" />
                    {t('auth.registerWithGoogle')}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleFacebookLogin}
                  >
                    <Facebook className="mr-2 h-4 w-4" />
                    {t('auth.registerWithFacebook')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}