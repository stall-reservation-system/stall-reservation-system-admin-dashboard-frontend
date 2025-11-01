import DashboardLayout from "@/components/DashboardLayout";
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
  // Mock data for stalls
  const stalls: Stall[] = [
    // Section A - Small stalls
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `A${(i + 1).toString().padStart(2, '0')}`,
      size: "small" as StallSize,
      status: (i < 14 ? "reserved" : "available") as StallStatus,
      publisher: i < 14 ? `Publisher ${i + 1}` : undefined,
    })),
    // Section B - Medium stalls
    ...Array.from({ length: 15 }, (_, i) => ({
      id: `B${(i + 1).toString().padStart(2, '0')}`,
      size: "medium" as StallSize,
      status: (i < 10 ? "reserved" : "available") as StallStatus,
      publisher: i < 10 ? `Publisher ${i + 21}` : undefined,
    })),
    // Section C - Large stalls
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `C${(i + 1).toString().padStart(2, '0')}`,
      size: "large" as StallSize,
      status: (i < 7 ? "reserved" : "available") as StallStatus,
      publisher: i < 7 ? `Publisher ${i + 36}` : undefined,
    })),
  ];

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
