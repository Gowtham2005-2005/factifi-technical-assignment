"use client"

import { useRouter } from "next/navigation"
import { ArrowRight, Compass, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFactCheckStore } from "@/lib/store"

export function ExploreContent() {
  const router = useRouter()
  const { setClaim, setAutoSubmit } = useFactCheckStore()

  const handleExampleClick = (example: string) => {
    setClaim(example)
    setAutoSubmit(true)
    router.push("/")
  }

  const trendingTopics = [
    {
      claim: "5G causes health problems",
      category: "Technology",
      searches: 12500,
    },
    {
      claim: "Vaccines cause autism",
      category: "Health",
      searches: 9800,
    },
    {
      claim: "Coffee prevents cancer",
      category: "Nutrition",
      searches: 7600,
    },
    {
      claim: "Chicken causes infertility",
      category: "Nutrition",
      searches: 6200,
    },
    {
      claim: "Artificial sweeteners cause cancer",
      category: "Nutrition",
      searches: 5400,
    },
    {
      claim: "Vitamin C cures the common cold",
      category: "Health",
      searches: 4900,
    },
  ]

  const popularCategories = [
    {
      name: "Health & Medicine",
      count: 1245,
      icon: "🩺",
      examples: ["Vitamin D prevents COVID-19", "Drinking water cures headaches"],
    },
    {
      name: "Nutrition & Diet",
      count: 987,
      icon: "🥗",
      examples: ["Eggs increase cholesterol", "Gluten is harmful for everyone"],
    },
    {
      name: "Environment & Climate",
      count: 756,
      icon: "🌍",
      examples: ["Electric cars are worse for the environment", "Recycling plastic is ineffective"],
    },
    {
      name: "Technology",
      count: 543,
      icon: "💻",
      examples: ["AI will replace all human jobs", "Smartphones emit harmful radiation"],
    },
  ]

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 max-w-5xl">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Compass className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Explore</h1>
          <p className="text-muted-foreground">Discover trending topics and popular fact checks</p>
        </div>
      </div>

      <Tabs defaultValue="trending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="trending">Trending Topics</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Trending Claims</span>
                  </CardTitle>
                  <CardDescription>Most searched claims this week</CardDescription>
                </div>
                <Badge variant="outline" className="px-3 py-1">
                  Updated 2 hours ago
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {trendingTopics.map((topic, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden border hover:border-primary/50 transition-all hover:shadow-md cursor-pointer"
                    onClick={() => handleExampleClick(topic.claim)}
                  >
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {topic.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {topic.searches.toLocaleString()} searches
                          </span>
                        </div>
                        <p className="font-medium">{topic.claim}</p>
                      </div>
                      <div className="bg-muted/30 p-3 border-t flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Click to fact check</span>
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {popularCategories.map((category, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    <span>{category.name}</span>
                  </CardTitle>
                  <CardDescription>{category.count} fact checks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.examples.map((example, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => handleExampleClick(example)}
                    >
                      {example}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ))}
                </CardContent>
                <CardFooter className="bg-muted/30 border-t">
                  <Button variant="ghost" className="w-full" onClick={() => router.push("/")}>
                    View all in {category.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
