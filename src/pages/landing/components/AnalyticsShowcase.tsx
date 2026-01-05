import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Eye,
  TrendingUp,
  Globe,
  Smartphone,
} from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const analyticsData = [
  { day: "Mon", scans: 120 },
  { day: "Tue", scans: 180 },
  { day: "Wed", scans: 150 },
  { day: "Thu", scans: 220 },
  { day: "Fri", scans: 280 },
  { day: "Sat", scans: 190 },
  { day: "Sun", scans: 140 },
];

const maxScans = Math.max(...analyticsData.map((d) => d.scans));

const stats = [
  { icon: <Eye className="h-3.5 w-3.5" />, label: "Total Scans", value: "24,892" },
  { icon: <TrendingUp className="h-3.5 w-3.5" />, label: "Growth Rate", value: "+34%" },
  { icon: <Globe className="h-3.5 w-3.5" />, label: "Countries", value: "45+" },
  { icon: <Smartphone className="h-3.5 w-3.5" />, label: "Mobile Scans", value: "89%" },
];

const AnalyticsShowcase = () => {
  return (
    <section
      id="analytics"
      className="py-10 md:py-12 lg:py-16 bg-muted/20 border-y border-border/50"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center max-w-5xl mx-auto">
          {/* Left: Content */}
          <AnimatedSection>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
                <BarChart3 className="h-3 w-3" />
                <span>Real-Time Analytics</span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight">
                Track Every Scan with
                <span className="text-primary"> Powerful Insights</span>
              </h2>
              <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                Understand your audience better with comprehensive analytics.
                See who scans your QR codes, when, and from where.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-background border border-border rounded-lg p-3"
                  >
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      {stat.icon}
                      <span className="text-[10px]">{stat.label}</span>
                    </div>
                    <div className="text-lg font-semibold">{stat.value}</div>
                  </div>
                ))}
              </div>

              <Link to="/signup">
                <Button size="sm" className="gap-1.5 text-xs">
                  View Full Analytics
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          {/* Right: Analytics Chart Mock */}
          <AnimatedSection delay={200}>
            <Card className="p-5 bg-background">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-semibold">Weekly Scan Activity</h4>
                  <p className="text-[10px] text-muted-foreground">
                    Last 7 days performance
                  </p>
                </div>
                <div className="flex items-center gap-1 text-primary text-xs font-medium">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +12.5%
                </div>
              </div>

              {/* Chart visualization */}
              <div className="flex items-end gap-2 h-32 mb-3">
                {analyticsData.map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full bg-primary/20 rounded-t-sm relative overflow-hidden transition-all duration-500"
                      style={{
                        height: `${(data.scans / maxScans) * 100}%`,
                        minHeight: "8px",
                      }}
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-sm transition-all duration-700"
                        style={{ height: "100%" }}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground">
                      {data.day}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chart legend */}
              <div className="flex items-center justify-center gap-4 pt-2 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-[10px] text-muted-foreground">Scans</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary/30" />
                  <span className="text-[10px] text-muted-foreground">
                    Unique Visitors
                  </span>
                </div>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsShowcase;
