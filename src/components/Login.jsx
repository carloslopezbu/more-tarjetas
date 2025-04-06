import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "./ui/login-form"

export default function Login() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <img
          src="/more.jpeg"
          alt="Image"
        />
      </div>
    </div>
  )
}
