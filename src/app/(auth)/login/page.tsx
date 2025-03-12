import { LoginForm } from '@/components/login-form'
import Image from 'next/image'
import React from 'react'

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex justify-center">
          <Image
            src="/logo_vietravel.png"
            alt="Vietravel logo"
            width={200}
            height={200}
          />
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
