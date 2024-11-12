import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large"
  color?: "primary" | "secondary" | "white"
}

export default function LoadingSpinner({ size = "large", color = "primary" }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "w-5 h-5",
    medium: "w-8 h-8",
    large: "w-12 h-12"
  }

  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    white: "text-white"
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} 
      />
    </div>
  )
}