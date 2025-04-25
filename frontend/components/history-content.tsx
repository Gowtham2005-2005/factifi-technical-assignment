"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Calendar, Clock, History, Search, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFactCheckStore } from "@/lib/store"

export function HistoryContent() {
  const router = useRouter()
  const { setClaim, setAutoSubmit } = useFactCheckStore()
  const [searchQuery, setSearchQuery] = useState("")

  const handleHistoryItemClick = (claim: string) => {
    setClaim(claim)
    setAutoSubmit(true)
    router.push("/")
  }

  // Mock history data
  const recentHistory = [
    {
      id: 1,
      claim: "Coffee prevents cancer",
      date: "April 24, 2025",
      time: "10:45 AM",
      assessment: "Lacks Sufficient Evidence",
    },
    {
      id: 2,
      claim: "Vitamin C cures the common cold",
      date: "April 23, 2025",
      time: "3:22 PM",
      assessment: "Mostly False",
    },
    {
      id: 3,
      claim: "Eggs increase cholesterol",
      date: "April 22, 2025",
      time: "9:15 AM",
      assessment: "Mostly True",
    },
    {
      id: 4,
      claim: "5G causes health problems",
      date: "April 21, 2025",
      time: "2:30 PM",
      assessment: "False",
    },
  ]

  const savedHistory = [
    {
      id: 5,
      claim: "Artificial sweeteners cause cancer",
      date: "April 20, 2025",
      time: "11:05 AM",
      assessment: "Lacks Sufficient Evidence",
      saved: true,
    },
    {
      id: 6,
      claim: "Vaccines cause autism",
      date: "April 18, 2025",
      time: "4:50 PM",
      assessment: "False",
      saved: true,
    },
  ]

  const getAssessmentColor = (assessment: string) => {
    switch (assessment.toLowerCase()) {
      case "true":
      case "mostly true":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
      case "false":
      case "mostly false":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
      case "lacks sufficient evidence":
      case "inconclusive":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
      default:
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
    }
  }

  const filteredRecent = recentHistory.filter((item) => item.claim.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredSaved = savedHistory.filter((item) => item.claim.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 max-w-5xl">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <History className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">History</h1>
          <p className="text-muted-foreground">View your past fact check requests</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search your history..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 rounded-lg"
        />
      </div>

      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          {filteredRecent.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No results found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {searchQuery
                    ? `No history items matching "${searchQuery}"`
                    : "You haven't checked any facts recently"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRecent.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-md cursor-pointer"
                onClick={() => handleHistoryItemClick(item.claim)}
              >
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`px-2 py-1 ${getAssessmentColor(item.assessment)}`}>{item.assessment}</Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {item.date}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.time}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-medium">{item.claim}</p>
                  </div>
                  <div className="bg-muted/30 p-3 border-t flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Click to view details</span>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          {filteredSaved.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No saved items found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {searchQuery ? `No saved items matching "${searchQuery}"` : "You haven't saved any fact checks yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSaved.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-md cursor-pointer"
                onClick={() => handleHistoryItemClick(item.claim)}
              >
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`px-2 py-1 ${getAssessmentColor(item.assessment)}`}>{item.assessment}</Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {item.date}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.time}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-medium">{item.claim}</p>
                  </div>
                  <div className="bg-muted/30 p-3 border-t flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Click to view details</span>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
