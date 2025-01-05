import Link from "next/link";

export default function UnauthorizedPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <Link href="/">Return to Homepage</Link>
        <p>You don't have permission to access this page.</p>
      </div>
    )
  }