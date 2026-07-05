'use client'

// ─── Imports ─────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, Eye, EyeOff, Globe } from 'lucide-react'

import { loginSchema, LoginFormValues } from '@/schemas/login'
import { Lang } from '@/lib/i18n/translations'
import { useLang } from '@/lib/i18n/context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { login } from './action'
import { toast } from 'sonner'

// ─── Constants ────────────────────────────────────────────────────────────────
const LANG_OPTIONS: { value: Lang; label: string; native: string }[] = [
  { value: 'vi', label: 'Tiếng Việt', native: 'VI' },
  { value: 'en', label: 'English',    native: 'EN' },
  { value: 'cn', label: '中文',        native: '中' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoginPage() {

  // ── i18n ────────────────────────────────────────────────────────────────────
  const { t, lang, setLang } = useLang()

  // ── Local state ─────────────────────────────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false)

  // ── Form setup ──────────────────────────────────────────────────────────────
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // ── Submit handler ───────────────────────────────────────────────────────────
  async function onSubmit(data: LoginFormValues) {
    const result = await login(data)
    if (result) {
      toast.error(result.error)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className='relative flex h-screen w-screen items-center justify-center bg-muted'>

      {/* Language switcher — top right */}
      <div className='absolute top-4 right-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm' className='gap-2'>
              <Globe className='size-4' />
              {LANG_OPTIONS.find(o => o.value === lang)!.native}
              <ChevronDown className='size-3 text-muted-foreground' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {LANG_OPTIONS.map(opt => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => setLang(opt.value)}
                data-active={lang === opt.value}
                className='gap-2 data-[active=true]:font-medium'
              >
                <span className='w-5 text-center text-muted-foreground'>{opt.native}</span>
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className='w-full max-w-sm shadow-md'>

        {/* Header */}
        <CardHeader>
          <CardTitle className='text-xl'>{t.login.title}</CardTitle>
          <CardDescription>{t.login.description}</CardDescription>
        </CardHeader>

        {/* Form */}
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>

              {/* Email */}
              <Controller
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>{t.login.email}</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder='you@example.com'
                      autoComplete='email'
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Password */}
              <Controller
                name='password'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>{t.login.password}</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type={showPassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        autoComplete='current-password'
                        aria-invalid={fieldState.invalid}
                      />
                      {/* Toggle hiển thị / ẩn mật khẩu */}
                      <InputGroupAddon align='inline-end'>
                        <InputGroupButton
                          size='icon-xs'
                          aria-label={showPassword ? t.login.hidePassword : t.login.showPassword}
                          onClick={() => setShowPassword(prev => !prev)}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Submit */}
              <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t.login.submitting : t.login.submit}
              </Button>

            </FieldGroup>
          </form>
        </CardContent>

      </Card>
    </div>
  )
}
