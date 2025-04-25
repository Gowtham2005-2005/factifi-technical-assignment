"use client"

import { useRouter } from "next/navigation"
import { ArrowRight, CheckCircle, Clock, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFactCheckStore } from "@/lib/store"

export function WelcomeScreen() {
  const router = useRouter()
  const { setClaim, setAutoSubmit } = useFactCheckStore()

  const handleExampleClick = (example: string) => {
    setClaim(example)
    setAutoSubmit(true)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Welcome to Factifi</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered fact-checking assistant. Enter a claim below to verify its accuracy with research-backed
          evidence.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-md">
          <CardHeader className="pb-2">
            <Search className="h-8 w-8 text-primary" />
            <CardTitle className="text-xl">Fast Verification</CardTitle>
            <CardDescription>Get research-backed results in seconds</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our AI analyzes multiple research papers to provide accurate fact-checking results quickly.
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-md">
          <CardHeader className="pb-2">
            <CheckCircle className="h-8 w-8 text-primary" />
            <CardTitle className="text-xl">Evidence-Based</CardTitle>
            <CardDescription>Backed by scientific research</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Every fact check is supported by academic papers and reliable sources with full transparency.
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-md">
          <CardHeader className="pb-2">
            <Clock className="h-8 w-8 text-primary" />
            <CardTitle className="text-xl">Save Time</CardTitle>
            <CardDescription>No more endless searching</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Stop spending hours researching claims. Get comprehensive analysis in one place.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Try an example</CardTitle>
          <CardDescription>Click on one of these examples to see how Factifi works</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2">
          <Button
            variant="outline"
            className="justify-between rounded-full"
            onClick={() => handleExampleClick("Chicken causes infertility")}
          >
            Chicken causes infertility
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="justify-between rounded-full"
            onClick={() => handleExampleClick("Coffee prevents cancer")}
          >
            Coffee prevents cancer
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="justify-between rounded-full"
            onClick={() => handleExampleClick("5G causes health problems")}
          >
            5G causes health problems
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="justify-between rounded-full"
            onClick={() => handleExampleClick("Vaccines cause autism")}
          >
            Vaccines cause autism
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-4">
          <p className="text-sm text-muted-foreground">Or type your own claim in the input box below to get started.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
