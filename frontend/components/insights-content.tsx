"use client"

import { Calendar, Lightbulb, PieChart, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"
import { useTheme } from "next-themes"

export function InsightsContent() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // Mock data for charts
  const activityData = [
    { name: "Mon", checks: 12 },
    { name: "Tue", checks: 19 },
    { name: "Wed", checks: 8 },
    { name: "Thu", checks: 15 },
    { name: "Fri", checks: 23 },
    { name: "Sat", checks: 17 },
    { name: "Sun", checks: 10 },
  ]

  const categoryData = [
    { name: "Health", value: 35 },
    { name: "Nutrition", value: 25 },
    { name: "Technology", value: 20 },
    { name: "Environment", value: 15 },
    { name: "Other", value: 5 },
  ]

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  const topMisconceptions = [
    {
      claim: "5G causes health problems",
      searches: 12500,
      assessment: "False",
    },
    {
      claim: "Vaccines cause autism",
      searches: 9800,
      assessment: "False",
    },
    {
      claim: "Coffee prevents cancer",
      searches: 7600,
      assessment: "Lacks Sufficient Evidence",
    },
    {
      claim: "Vitamin C cures the common cold",
      searches: 4900,
      assessment: "Mostly False",
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

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 max-w-5xl">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Lightbulb className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Insights</h1>
          <p className="text-muted-foreground">Analytics and trends from your fact checks</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="misconceptions">Top Misconceptions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Activity</span>
                </CardTitle>
                <CardDescription>Your fact checking activity over the past week</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={activityData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <XAxis dataKey="name" stroke={isDark ? "#94a3b8" : "#64748b"} />
                      <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? "#1e293b" : "#ffffff",
                          borderColor: isDark ? "#334155" : "#e2e8f0",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="checks" fill="#3b82f6" name="Fact Checks" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PieChart className="h-5 w-5 text-primary" />
                  <span>Categories</span>
                </CardTitle>
                <CardDescription>Distribution of fact checks by category</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string) => [`${value}%`, name]}
                        contentStyle={{
                          backgroundColor: isDark ? "#1e293b" : "#ffffff",
                          borderColor: isDark ? "#334155" : "#e2e8f0",
                        }}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Summary</span>
              </CardTitle>
              <CardDescription>Your fact checking statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2 border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Checks</h3>
                  <p className="text-2xl font-bold">104</p>
                </div>
                <div className="space-y-2 border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">This Week</h3>
                  <p className="text-2xl font-bold">23</p>
                </div>
                <div className="space-y-2 border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Saved</h3>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="space-y-2 border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Shared</h3>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trending Topics</CardTitle>
              <CardDescription>Popular topics in fact checking this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={[
                      { topic: "Health", checks: 450 },
                      { topic: "Nutrition", checks: 380 },
                      { topic: "Technology", checks: 320 },
                      { topic: "Environment", checks: 280 },
                      { topic: "Politics", checks: 250 },
                      { topic: "Science", checks: 220 },
                      { topic: "Education", checks: 180 },
                    ]}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" stroke={isDark ? "#94a3b8" : "#64748b"} />
                    <YAxis dataKey="topic" type="category" stroke={isDark ? "#94a3b8" : "#64748b"} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#1e293b" : "#ffffff",
                        borderColor: isDark ? "#334155" : "#e2e8f0",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="checks" fill="#3b82f6" name="Fact Checks" radius={[0, 4, 4, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="misconceptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Misconceptions</CardTitle>
              <CardDescription>Most common false or misleading claims</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topMisconceptions.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`px-2 py-1 ${getAssessmentColor(item.assessment)}`}>{item.assessment}</Badge>
                        <span className="text-sm text-muted-foreground">{item.searches.toLocaleString()} searches</span>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full">
                        View Details
                      </Button>
                    </div>
                    <p className="font-medium">{item.claim}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assessment Distribution</CardTitle>
              <CardDescription>Distribution of fact check results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: "True", value: 15 },
                        { name: "Mostly True", value: 20 },
                        { name: "Lacks Sufficient Evidence", value: 30 },
                        { name: "Mostly False", value: 25 },
                        { name: "False", value: 10 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#84cc16" />
                      <Cell fill="#eab308" />
                      <Cell fill="#f97316" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [`${value}%`, name]}
                      contentStyle={{
                        backgroundColor: isDark ? "#1e293b" : "#ffffff",
                        borderColor: isDark ? "#334155" : "#e2e8f0",
                      }}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
