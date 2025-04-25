"use client"

import { CheckCircle, Clock, FileSearch, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"

export function LoadingAnimation() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { id: 0, label: "Extracting keywords", icon: Search, duration: 2000 },
    { id: 1, label: "Searching for relevant papers", icon: FileSearch, duration: 3000 },
    { id: 2, label: "Analyzing research findings", icon: Clock, duration: 4000 },
    { id: 3, label: "Generating assessment", icon: CheckCircle, duration: 2000 },
  ]

  useEffect(() => {
    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0)
    const interval = 50 // Update every 50ms

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 100 / (totalDuration / interval)
      })
    }, interval)

    // Step progression
    const stepTimers: NodeJS.Timeout[] = []
    let elapsed = 0

    steps.forEach((step, index) => {
      elapsed += step.duration
      const timer = setTimeout(() => {
        setCurrentStep(index + 1)
      }, elapsed)
      stepTimers.push(timer)
    })

    return () => {
      clearInterval(timer)
      stepTimers.forEach((t) => clearTimeout(t))
    }
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-center">Checking facts...</h3>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">{Math.round(progress)}%</p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isComplete = currentStep > step.id
            const isActive = currentStep === step.id

            return (
              <div key={step.id} className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center",
                    isComplete
                      ? "bg-green-500/20 text-green-600 dark:text-green-400"
                      : isActive
                        ? "bg-primary/20 text-primary animate-pulse"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  <StepIcon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isComplete
                        ? "text-green-600 dark:text-green-400"
                        : isActive
                          ? "text-primary"
                          : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </p>
                  {isComplete && <p className="text-xs text-muted-foreground">Completed</p>}
                  {isActive && <p className="text-xs text-primary animate-pulse">In progress...</p>}
                </div>
                {isComplete && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
