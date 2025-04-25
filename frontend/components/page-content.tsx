import { History, Home, Info, Lightbulb, Search, Settings, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PageContentProps {
  title: string
  description: string
  icon: "home" | "search" | "history" | "lightbulb" | "user" | "settings" | "info"
}

export function PageContent({ title, description, icon }: PageContentProps) {
  const Icon = {
    home: Home,
    search: Search,
    history: History,
    lightbulb: Lightbulb,
    user: User,
    settings: Settings,
    info: Info,
  }[icon]

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 max-w-5xl">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>This page is under development</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            The {title.toLowerCase()} page is currently being developed. Check back soon for updates or explore other
            features of Factifi.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
