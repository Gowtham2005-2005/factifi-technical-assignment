import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: string
  isUser: boolean
  timestamp: Date
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] md:max-w-[70%] rounded-lg p-4",
          isUser ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message}</p>
        <div className={cn("text-xs mt-1", isUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {format(timestamp, "MMM d, yyyy h:mm a")}
        </div>
      </div>
    </div>
  )
}
