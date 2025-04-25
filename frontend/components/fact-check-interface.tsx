"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { RotateCcw, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FactCheckResult } from "@/components/fact-check-result"
import { LoadingAnimation } from "@/components/loading-animation"
import { Card, CardContent } from "@/components/ui/card"
import { WelcomeScreen } from "@/components/welcome-screen"
import type { FactCheckResponse } from "@/types/fact-check"
import { cn } from "@/lib/utils"
import { useFactCheckStore } from "@/lib/store"
import { ChatMessage } from "@/components/chat-message"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function FactCheckInterface() {
  const router = useRouter()
  const { claim: storeClaim, autoSubmit, resetClaim } = useFactCheckStore()
  const [claim, setClaim] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<FactCheckResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean; timestamp: Date }>>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [activeTab, setActiveTab] = useState<string>("chat")

  useEffect(() => {
    if (storeClaim) {
      setClaim(storeClaim)
      if (autoSubmit) {
        handleSubmit(new Event("submit") as unknown as React.FormEvent)
        resetClaim()
      }
    }
  }, [storeClaim, autoSubmit, resetClaim])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!claim.trim() || isLoading) return

    // Add user message to chat
    setMessages((prev) => [...prev, { text: claim, isUser: true, timestamp: new Date() }])

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const apiUrl = "http://localhost:8000/api/v1/fact-check"
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ claim: claim }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const factCheckResult: FactCheckResponse = await response.json()
      setResult(factCheckResult)

      // Add response message to chat
      setMessages((prev) => [
        ...prev,
        {
          text: `Assessment: ${factCheckResult.assessment}. ${factCheckResult.explanation}`,
          isUser: false,
          timestamp: new Date(),
        },
      ])

      // Switch to result tab when we get a result
      setActiveTab("result")

      // Reset the input
      setClaim("")
    } catch (err) {
      console.error("Error fetching fact check:", err)
      setError("Failed to check fact. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
    setClaim("")
    setMessages([])
    setActiveTab("chat")
  }

  const handleViewFullReport = () => {
    if (result) {
      router.push(`/report?claim=${encodeURIComponent(result.claim)}`)
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length > 0 || result ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="result">Fact Check Result</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message.text} isUser={message.isUser} timestamp={message.timestamp} />
              ))}
            </TabsContent>

            <TabsContent value="result" className="focus-visible:outline-none focus-visible:ring-0">
              {result && <FactCheckResult result={result} onViewFullReport={handleViewFullReport} />}
            </TabsContent>
          </Tabs>
        ) : (
          !isLoading && <WelcomeScreen />
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <LoadingAnimation />
          </div>
        )}

        {error && !isLoading && (
          <Card className="mx-auto max-w-3xl">
            <CardContent className="p-6">
              <div className="bg-destructive/10 p-4 rounded-lg text-center">
                <p className="text-destructive">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="sticky bottom-0 border-t bg-card/80 backdrop-blur-sm p-4 md:p-6">
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              placeholder="Enter a claim for fact checking"
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[60px] max-h-[120px] rounded-full resize-none py-4 pl-5 pr-12 shadow-sm border-2 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
              disabled={isLoading}
            />
          </div>
          {(result || messages.length > 0) && (
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="rounded-full h-[60px] w-[60px] flex-shrink-0 shadow-md"
              onClick={handleReset}
            >
              <RotateCcw className="h-5 w-5" />
              <span className="sr-only">Reset</span>
            </Button>
          )}
          <Button
            type="submit"
            size="icon"
            className={cn(
              "rounded-full h-[60px] w-[60px] flex-shrink-0 shadow-md transition-all duration-300",
              isLoading || !claim.trim()
                ? "bg-muted text-muted-foreground"
                : "bg-primary hover:bg-primary/90 hover:scale-105",
            )}
            disabled={isLoading || !claim.trim()}
          >
            <Send className={`h-5 w-5 ${isLoading ? "opacity-50" : ""}`} />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}