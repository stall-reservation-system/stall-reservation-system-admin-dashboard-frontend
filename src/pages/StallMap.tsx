import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StallSize = "small" | "medium" | "large";
type StallStatus = "available" | "reserved";

interface Stall {
  id: string;
  size: StallSize;
  status: StallStatus;
  publisher?: string;
}

const StallMap = () => {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/stalls")
      .then((r) => r.json())
      .then((data) => mounted && setStalls(data))
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const getSizeClass = (size: StallSize) => {
    switch (size) {
      case "small":
        return "col-span-1";
      case "medium":
        return "col-span-2";
      case "large":
        return "col-span-3";
    }
  };

  const getStallColor = (status: StallStatus) => {
    return status === "reserved" 
      ? "bg-muted border-muted-foreground/20" 
      : "bg-accent border-accent hover:bg-accent/80 cursor-pointer";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Stall Map</h2>
            <p className="text-muted-foreground">
              Interactive venue map showing all stall locations and their status
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-accent"></div>
              <span className="text-sm text-foreground">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted"></div>
              <span className="text-sm text-foreground">Reserved</span>
            </div>
          </div>
        </div>

        {/* Section A - Small Stalls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Section A - Small Stalls</span>
              <Badge variant="outline">20 stalls</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-3">
              {stalls
                .filter((s) => s.id.startsWith("A"))
                .map((stall) => (
                  <div
                    key={stall.id}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all",
                      getSizeClass(stall.size),
                      getStallColor(stall.status)
                    )}
                  >
                    <div className="text-sm font-bold text-foreground">{stall.id}</div>
                    {stall.status === "reserved" && stall.publisher && (
                      <div className="text-xs text-muted-foreground mt-1 truncate">
                        {stall.publisher}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Section B - Medium Stalls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Section B - Medium Stalls</span>
              <Badge variant="outline">15 stalls</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-3">
              {stalls
                .filter((s) => s.id.startsWith("B"))
                .map((stall) => (
                  <div
                    key={stall.id}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all",
                      getSizeClass(stall.size),
                      getStallColor(stall.status)
                    )}
                  >
                    <div className="text-sm font-bold text-foreground">{stall.id}</div>
                    {stall.status === "reserved" && stall.publisher && (
                      <div className="text-xs text-muted-foreground mt-1 truncate">
                        {stall.publisher}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Section C - Large Stalls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Section C - Large Stalls</span>
              <Badge variant="outline">10 stalls</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-3">
              {stalls
                .filter((s) => s.id.startsWith("C"))
                .map((stall) => (
                  <div
                    key={stall.id}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all",
                      getSizeClass(stall.size),
                      getStallColor(stall.status)
                    )}
                  >
                    <div className="text-sm font-bold text-foreground">{stall.id}</div>
                    {stall.status === "reserved" && stall.publisher && (
                      <div className="text-xs text-muted-foreground mt-1 truncate">
                        {stall.publisher}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StallMap;
