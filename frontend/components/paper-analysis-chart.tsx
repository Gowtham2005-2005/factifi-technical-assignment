"use client"
import React from "react"  // Add this import
import { useTheme } from "next-themes"
import type { Paper } from "@/types/fact-check"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from "recharts"

interface PaperAnalysisChartProps {
  papers: Paper[]
}

export function PaperAnalysisChart({ papers }: PaperAnalysisChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined)

  // Count papers by relevance
  const relevanceCounts = papers.reduce(
    (acc, paper) => {
      const relevance = paper.relevance || "Unknown"
      acc[relevance] = (acc[relevance] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const relevanceData = Object.entries(relevanceCounts).map(([name, value]) => ({
    name,
    value,
  }))

  // Colors for the chart - enhanced for dark mode visibility
  const COLORS = {
    High: isDark ? "#4ade80" : "#16a34a", // Brighter green for dark mode
    Medium: isDark ? "#facc15" : "#ca8a04", // Brighter yellow for dark mode
    Low: isDark ? "#f87171" : "#dc2626", // Brighter red for dark mode
    Unknown: isDark ? "#cbd5e1" : "#64748b", // Lighter gray for dark mode
  }

  const getColor = (name: string) => {
    return COLORS[name as keyof typeof COLORS] || COLORS.Unknown
  }

  // If there's no data, show a message
  if (relevanceData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No research paper data available</p>
      </div>
    )
  }

  // Calculate total papers for legend
  const totalPapers = relevanceData.reduce((sum, entry) => sum + entry.value, 0)

  // Custom legend formatter to show count and percentage
  const legendFormatter = (value: string) => {
    const count = relevanceCounts[value] || 0
    const percentage = Math.round((count / totalPapers) * 100)
    return (
      <span style={{ color: isDark ? "#e2e8f0" : "#1e293b", fontWeight: 500 }}>
        {value} ({count} - {percentage}%)
      </span>
    )
  }

  // Custom active shape renderer for better hover effects
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.9}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 4}
          outerRadius={innerRadius - 1}
          fill={fill}
        />
      </g>
    );
  };
  
  // Handle mouse enter/leave for hover effects
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <Pie
          data={relevanceData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={40}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          paddingAngle={2}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
        >
          {relevanceData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={getColor(entry.name)} 
              stroke={isDark ? "#0f172a" : "#f8fafc"} 
              strokeWidth={1.5}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [
            `${value} papers (${Math.round((value / totalPapers) * 100)}%)`, 
            name
          ]}
          contentStyle={{
            backgroundColor: isDark ? "#334155" : "#ffffff", // Darker background in dark mode
            borderColor: isDark ? "#64748b" : "#e2e8f0", // Darker border in dark mode
            borderRadius: "0.5rem",
            padding: "8px 12px",
            boxShadow: isDark ? "0 4px 12px rgba(0, 0, 0, 0.6)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            fontSize: "12px",
            color: isDark ? "#f8fafc" : "#0f172a", // Brighter text in dark mode
          }}
          itemStyle={{
            padding: "4px 0",
            color: isDark ? "#f8fafc" : "#0f172a",
          }}
          labelStyle={{
            color: isDark ? "#f8fafc" : "#0f172a",
            fontWeight: "bold",
          }}
          cursor={false} // Disable default cursor
        />
        <Legend 
          formatter={legendFormatter}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          iconSize={10}
          iconType="circle"
          wrapperStyle={{
            fontSize: "12px",
            paddingTop: "15px",
            color: isDark ? "#e2e8f0" : "#1e293b",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}