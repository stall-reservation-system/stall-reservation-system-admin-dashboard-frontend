import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CheckCircle2, XCircle, Package } from "lucide-react";
import { useEffect, useState } from "react";

type Stat = { title: string; value: number | string; color?: string; icon?: any; description?: string };
type Activity = { publisher: string; stalls: string; time: string; status: string };

const Dashboard = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recent, setRecent] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setStats(data.stats || []);
        setRecent(data.recentActivity || []);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const icons = [Building2, CheckCircle2, Package, XCircle];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your stall reservations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-muted-foreground">Loading stats…</div>
          ) : (
            stats.map((stat, idx) => {
              const Icon = icons[idx % icons.length];
              return (
                <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <Icon className={cn("h-5 w-5", stat.color || "")} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    {stat.description && (
                      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-muted-foreground">Loading activity…</div>
              ) : (
                recent.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{activity.publisher}</p>
                      <p className="text-sm text-muted-foreground">Stalls: {activity.stalls}</p>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "inline-block px-3 py-1 rounded-full text-xs font-medium mb-1",
                        activity.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      )}>{activity.status}</span>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
