import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '../../../auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'

import CredentialsSignInForm from './credentials-signin-form'

import SeparatorWithOr from '../../../components/shared/separator-or'

export const metadata: Metadata = {
  title: `Sign In - Tibb-Jox`,
}

export default async function SignIn({
  searchParams: { callbackUrl },
}: {
  searchParams: {
    callbackUrl: string
  }
}) {
  const session = await auth()
  if (session) {
    return redirect(callbackUrl || '/')
  }

  return (
    <div className="w-full h-screen flex justify-center items-center max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex justify-center">
            <Image
              src="/images/appIcon.png"
              width={100}
              height={100}
              alt={`Tibb-Jox logo`}
            />
          </Link>
          <CardTitle className="text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Select a method to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* <GoogleSignInForm /> */}
          {/* <SeparatorWithOr /> */}
          {/* <EmailSigninForm /> */}
          {/* <SeparatorWithOr /> */}
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  )
}