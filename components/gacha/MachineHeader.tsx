import { Crown, Package, Store, User, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePrivy } from "@privy-io/react-auth"
import { SoundToggle } from "@/components/sound-toggle"
import { useRouter } from "next/navigation"


export const MachineHeader = ({ name, subtitle, isDark }: { name: string, subtitle: string, isDark: boolean }) => {
    const { login, logout, user } = usePrivy()
    const router = useRouter()

    const sliceAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    const handleHomeClick = () => {
        router.push('/')
    }

    return (
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center w-full max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Crown className="w-8 h-8 md:w-10 md:h-10 text-amber-400 drop-shadow-lg" />
                    <div className="absolute inset-0 w-8 h-8 md:w-10 md:h-10 text-amber-400 animate-ping opacity-20">
                        <Crown className="w-full h-full" />
                    </div>
                </div>
                <div>
                    <h1
                        className={cn(
                            "text-3xl md:text-5xl font-bold tracking-tight",
                            isDark ? "text-slate-800" : "text-white",
                            "drop-shadow-lg",
                        )}
                    >
                        {name}
                    </h1>
                    <p
                        className={cn(
                            "text-sm md:text-base font-medium tracking-wide hidden sm:block",
                            isDark ? "text-slate-600" : "text-white",
                        )}
                    >
                        {subtitle}
                    </p>
                </div>
            </div>

            <div className="flex gap-3 md:gap-4 items-center">
                <SoundToggle />
                {user && (
                    <div className="px-3 py-2 border-1 border-slate-200 rounded-md text-sm bg-white/80 backdrop-blur-sm md:text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                        {sliceAddress(user?.wallet?.address || "")}
                    </div>
                )}
                <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/80 border-slate-200 text-slate-700 hover:bg-white backdrop-blur-sm"
                    onClick={handleHomeClick}
                >
                    <Home className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Home
                </Button>
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
            </div>
        </div>
    )
} 