
import Link from 'next/link'

import { auth } from '../../../auth'
import { SignOut } from '../../../lib/actions/user.actions'
import { Button } from '../../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../../ui/dropdown-menu'
import ModeToggle from './mode-toggle'

export default async function UserButton() {
  const session = await auth()
  if (!session)
    return (
      <Link href="/api/auth/signin">
        <Button>Sign In</Button>
      </Link>
    )
  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="relative w-fit h-8 rounded-full ml-2"
            >
              {session.user.name}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          {session.user.role === 'admin' && (
            <DropdownMenuItem>
            <Link className="w-full" href="/admin/overview">
              Admin
            </Link>
          </DropdownMenuItem>
        )}
        {session.user.role === 'vendor' && (
            <DropdownMenuItem>
            <Link className="w-full" href="/vendor/overview">
              Dashboard
            </Link>
            <Link className="w-full" href="/vendor/orders">
              Orders
            </Link>
          </DropdownMenuItem>
        )}
        {session.user.role == 'user' &&(
          <>
            <DropdownMenuItem>
            <Link className="w-full" href="/user/profile">
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
          <Link className="w-full" href="/user/orders">
            Order History
          </Link>
        </DropdownMenuItem>
          </>
        )}
          
          <DropdownMenuItem className="p-0 mb-1">
            <form action={SignOut} className="w-full">
              <Button
                className="w-full py-4 px-2 h-4 justify-start"
                variant="ghost"
              >
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
          {/* <ModeToggle /> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}