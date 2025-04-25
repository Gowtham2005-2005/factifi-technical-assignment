"use client"

import { useState } from "react"
import { ExternalLink, ChevronDown, FileText, BarChart2, Link2, Bookmark, Share2, InfoIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import type { FactCheckResponse } from "@/types/fact-check"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { PaperAnalysisChart } from "@/components/paper-analysis-chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FactCheckResultProps {
  result: FactCheckResponse
  onViewFullReport?: () => void
}

export function FactCheckResult({ result, onViewFullReport }: FactCheckResultProps) {
  const [activeTab, setActiveTab] = useState("summary")
  const [expandedReport, setExpandedReport] = useState(false)

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

  // Get assessment icon based on assessment text
  const getAssessmentIcon = (assessment: string) => {
    switch (assessment.toLowerCase()) {
      case "true":
      case "mostly true":
        return "✅"
      case "false":
      case "mostly false":
        return "❌"
      case "lacks sufficient evidence":
      case "inconclusive":
        return "⚠️"
      default:
        return "ℹ️"
    }
  }

  // Format the detailed report for better readability
  const formatDetailedReport = () => {
    if (!result.human_friendly_response) return null;
    
    return (
      <div className="space-y-6">
        <div className="space-y-3 border-b pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Claim Analysis</h3>
            <Badge className={`text-sm px-3 py-1.5 border ${getAssessmentColor(result.assessment)}`}>
              {getAssessmentIcon(result.assessment)} {result.assessment}
            </Badge>
          </div>
          <div className="bg-muted/30 p-3 rounded-md border">
            <p className="text-sm italic">"{result.claim}"</p>
          </div>
        </div>
        
        <div className="prose dark:prose-invert max-w-none text-sm md:text-base">
          <MarkdownRenderer content={result.human_friendly_response} />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="overflow-hidden border-2">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl">Fact Check Result</CardTitle>
              <CardDescription className="mt-1">
                Claim: <span className="font-medium">"{result.claim}"</span>
              </CardDescription>
            </div>
            <Badge className={`text-sm px-3 py-1.5 border ${getAssessmentColor(result.assessment)}`}>
              {result.assessment}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-muted/30">
              <TabsTrigger value="summary" className="flex items-center gap-2 data-[state=active]:bg-background">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Summary</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2 data-[state=active]:bg-background">
                <BarChart2 className="h-4 w-4" />
                <span className="hidden sm:inline">Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="sources" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Link2 className="h-4 w-4" />
                <span className="hidden sm:inline">Sources</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="p-6 focus-visible:outline-none focus-visible:ring-0">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-base leading-relaxed">{result.explanation}</p>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Research Analysis</h3>
                <div className="w-full h-[300px]">
                  <PaperAnalysisChart papers={result.papers} />
                </div>

                <Alert className="mt-4 bg-muted/50">
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Relevance Legend</AlertTitle>
                  <AlertDescription>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>
                        <span className="font-medium text-foreground">Note</span>: A high score on the 'Lacks Evidence' criterion indicates strong confidence that the assessment lacks sufficient evidence. Conversely, a high score on the 'Supported' criterion reflects strong confidence that the assessment is well-supported. The same logic applies to medium and low scores accordingly.
                      </li>
                      <br></br> 
                      <li>
                        <span className="font-medium text-green-600 dark:text-green-400">High</span>: Research directly
                        addresses the claim with strong evidence
                      </li>
                      <li>
                        <span className="font-medium text-yellow-600 dark:text-yellow-400">Medium</span>: Research is
                        related to the claim but with indirect evidence
                      </li>
                      <li>
                        <span className="font-medium text-red-600 dark:text-red-400">Low</span>: Research is
                        tangentially related with minimal relevance
                      </li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="p-6 space-y-4 focus-visible:outline-none focus-visible:ring-0">
              {result.paper_analyses.map((analysis, index) => (
                <Collapsible key={index} className="border rounded-lg overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="flex w-full justify-between p-4 rounded-none hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="rounded-full h-6 w-6 p-0 flex items-center justify-center">
                          {analysis.paper_number}
                        </Badge>
                        <span className="font-medium">
                          {result.papers[analysis.paper_number - 1]?.title || `Paper ${analysis.paper_number}`}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-t bg-muted/20">
                    <div className="p-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Authors:</h4>
                        <p className="text-sm mt-1">
                          {result.papers[analysis.paper_number - 1]?.authors?.join(", ") || "Unknown"}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Relevance:</h4>
                        <p className="text-sm mt-1">{result.papers[analysis.paper_number - 1]?.relevance || "Unknown"}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Position on Claim:</h4>
                        <p className="text-sm mt-1">{analysis.relation_to_claim}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Key Findings:</h4>
                        <p className="text-sm mt-1">{result.papers[analysis.paper_number - 1]?.key_findings || "Not specified"}</p>
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button variant="outline" size="sm" className="rounded-full" asChild>
                          <a
                            href={result.papers[analysis.paper_number - 1]?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Paper
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </TabsContent>

            <TabsContent value="sources" className="p-6 focus-visible:outline-none focus-visible:ring-0">
              <div className="grid gap-4 sm:grid-cols-2">
                {result.references.map((reference, index) => (
                  <Card key={index} className="overflow-hidden border hover:border-primary/50 transition-colors">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <h3 className="font-medium text-sm line-clamp-2 mb-1">{reference.title}</h3>
                        <p className="text-xs text-muted-foreground break-all line-clamp-1">{reference.url}</p>
                      </div>
                      <div className="bg-muted/30 p-3 border-t flex justify-end">
                        <Button variant="outline" size="sm" className="rounded-full h-8" asChild>
                          <a
                            href={reference.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Source
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/30 px-6 py-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full gap-1">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button variant="outline" size="sm" className="rounded-full gap-1">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
          {/* Only show View Full Report button if the handler exists */}
          {onViewFullReport && (
            <Button variant="outline" size="sm" className="rounded-full gap-1" onClick={onViewFullReport}>
              <ExternalLink className="h-4 w-4" />
              <span>View Full Report</span>
            </Button>
          )}
        </CardFooter>
      </Card>

      {result.human_friendly_response && (
        <Card className="border-2">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Detailed Report</CardTitle>
                <CardDescription>Comprehensive analysis of the claim with research findings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* No ScrollArea to allow natural content flow */}
            {expandedReport ? (
              // Show full content when expanded
              formatDetailedReport()
            ) : (
              // Show preview when collapsed
              <div className="relative">
                <div className="overflow-hidden max-h-64">
                  {formatDetailedReport()}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/30 px-6 py-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full gap-1"
              onClick={() => setExpandedReport(!expandedReport)}
            >
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedReport ? 'rotate-180' : ''}`} />
              <span>{expandedReport ? 'Show Less' : 'Show More'}</span>
            </Button>
            
            {onViewFullReport && (
              <Button variant="outline" size="sm" className="rounded-full gap-1" onClick={onViewFullReport}>
                <ExternalLink className="h-4 w-4" />
                <span>View Full Report</span>
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  )
}