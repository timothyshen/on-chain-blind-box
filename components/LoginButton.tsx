"use client"
import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"

const LoginButton = () => {
    const { login, logout, user } = usePrivy()

    return (
        <Button
            variant="outline"
            size="lg"
            className={cn(
                "text-sm md:text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl",
                "bg-white/80 border-slate-200 text-slate-700 hover:bg-white backdrop-blur-sm",
            )}
            onClick={user ? logout : login}
        >
            <User className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            {user ? "Logout" : "Login"}
        </Button>
    )
}

export default LoginButton