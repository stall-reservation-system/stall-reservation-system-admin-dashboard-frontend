import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CheckCircle2, XCircle, Package } from "lucide-react";

const Dashboard = () => {
  const [stalls, setStalls] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loadingStalls, setLoadingStalls] = useState(true);
  const [loadingReservations, setLoadingReservations] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoadingStalls(true);
    fetch('/api/stalls')
      .then((r) => r.json())
      .then((data) => mounted && setStalls(data || []))
      .catch(() => mounted && setStalls([]))
      .finally(() => mounted && setLoadingStalls(false));

    setLoadingReservations(true);
    fetch('/api/reservations')
      .then((r) => r.json())
      .then((data) => mounted && setReservations(data || []))
      .catch(() => mounted && setReservations([]))
      .finally(() => mounted && setLoadingReservations(false));

    return () => {
      mounted = false;
    };
  }, []);

  const totalStalls = stalls.length;
  const reservedCount = stalls.filter((s) => s.status === 'reserved').length;
  const availableCount = stalls.filter((s) => s.status === 'available').length;
  const pendingEmailCount = reservations.filter((r) => r.emailSent === false).length;

  const stats = [
    {
      title: "Total Stalls",
      value: loadingStalls ? '—' : String(totalStalls),
      icon: Building2,
      description: "All available stalls",
      color: "text-primary"
    },
    {
      title: "Reserved",
      value: loadingStalls ? '—' : String(reservedCount),
      icon: CheckCircle2,
      description: "Currently reserved",
      color: "text-green-600"
    },
    {
      title: "Available",
      value: loadingStalls ? '—' : String(availableCount),
      icon: Package,
      description: "Ready to book",
      color: "text-highlight"
    },
    {
      title: "Pending Email",
      value: loadingReservations ? '—' : String(pendingEmailCount),
      icon: XCircle,
      description: "Confirmation emails pending",
      color: "text-destructive"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your stall reservations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingReservations ? (
                <div className="text-sm text-muted-foreground">Loading recent activity…</div>
              ) : (
                (reservations.slice(0, 3)).map((res, index) => (
                  <div key={res.id || index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{res.publisher}</p>
                      <p className="text-sm text-muted-foreground">Stalls: {Array.isArray(res.stalls) ? res.stalls.join(', ') : res.stalls}</p>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "inline-block px-3 py-1 rounded-full text-xs font-medium mb-1",
                        res.emailSent ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      )}>
                        {res.emailSent ? 'confirmed' : 'pending'}
                      </span>
                      <p className="text-xs text-muted-foreground">{res.time ?? '-'}</p>
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
  return classes.filter(Boolean).join(' ');
}
