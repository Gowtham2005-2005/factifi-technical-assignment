import { Github } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function AboutContent() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6 max-w-5xl">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Github className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">About Factifi</h1>
          <p className="text-muted-foreground">Learn about our mission and technology</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api">API Documentation</TabsTrigger>
          <TabsTrigger value="team">Developer</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>Fighting misinformation with evidence-based research</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Factifi is dedicated to combating misinformation by providing research-backed fact checking. In an era
                where false information spreads rapidly, our AI-powered platform helps users verify claims against
                scientific evidence.
              </p>
              <p>
                We believe that access to accurate information is essential for making informed decisions. By leveraging
                artificial intelligence and academic research, we aim to make fact checking accessible, transparent, and
                reliable for everyone.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>The technology behind our fact checking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 border rounded-lg p-4">
                  <h3 className="font-medium">1. Claim Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI analyzes your claim and extracts key concepts for research.
                  </p>
                </div>
                <div className="space-y-2 border rounded-lg p-4">
                  <h3 className="font-medium">2. Research Search</h3>
                  <p className="text-sm text-muted-foreground">
                    We search academic databases for relevant scientific papers.
                  </p>
                </div>
                <div className="space-y-2 border rounded-lg p-4">
                  <h3 className="font-medium">3. Evidence Evaluation</h3>
                  <p className="text-sm text-muted-foreground">
                    Our system evaluates the evidence and provides a comprehensive assessment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fact Check API</CardTitle>
              <CardDescription>A production-ready FastAPI application for fact-checking claims</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Features</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Research-Based Fact Checking: Evaluates claims using academic papers and scientific evidence</li>
                <li>LLM Integration: Uses Google's Gemini AI to analyze findings</li>
                <li>Academic Paper Search: Searches for relevant papers via SERP API</li>
                <li>Structured API Response: Provides detailed analysis with citations</li>
                <li>Human-Friendly Output: Generates markdown-formatted reports</li>
              </ul>

              <Separator className="my-4" />

              <h3 className="text-lg font-medium">API Endpoints</h3>
              <div className="space-y-3">
                <div className="border rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded text-xs font-medium">
                      GET
                    </span>
                    <code className="text-sm">/api/v1/health</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Health check endpoint</p>
                </div>

                <div className="border rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded text-xs font-medium">
                      POST
                    </span>
                    <code className="text-sm">/api/v1/fact-check</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Submit a claim for fact checking</p>
                </div>
              </div>

              <Separator className="my-4" />

              <h3 className="text-lg font-medium">Example Request</h3>
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`curl -X POST http://localhost:8000/api/v1/fact-check \\
  -H "Content-Type: application/json" \\
  -d '{"claim": "Coffee consumption reduces the risk of heart disease"}'`}
                  </pre>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button variant="outline" className="gap-2" asChild>
                  <a href="https://github.com/Gowtham2005-2005/fact-check-api" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    <span>View on GitHub</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gowtham S</CardTitle>
              <CardDescription>Machine Learning and Full stack developer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="flex flex-col items-center text-center md:text-left">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold">GS</span>
                  </div>
                  <h3 className="font-medium">Gowtham S</h3>
                  <p className="text-sm text-muted-foreground">Third year CSE grad</p>
                  <Button variant="outline" size="sm" className="mt-2 gap-2" asChild>
                    <a href="https://github.com/Gowtham2005-2005" target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      <span>GitHub</span>
                    </a>
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  <h3 className="text-lg font-medium">About Me</h3>
                  <p>
                    I'm a third-year Computer Science Engineering student passionate about blending Machine Learning
                    with Full Stack development. My work focuses on creating intelligent web applications that leverage
                    the power of AI to solve real-world problems.
                  </p>
                  <p>
                    Factifi represents my interest in combining ML capabilities with modern web technologies to build
                    tools that help people access reliable information and combat misinformation.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="secondary">Machine Learning</Badge>
                    <Badge variant="secondary">Full Stack</Badge>
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">Next.js</Badge>
                    <Badge variant="secondary">Python</Badge>
                    <Badge variant="secondary">AI</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
