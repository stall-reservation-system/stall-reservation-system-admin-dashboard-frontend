import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Mail, QrCode, CheckCircle2, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Reservation {
  id: string;
  publisher: string;
  contact: string;
  email: string;
  stalls: string[];
  genre: string;
  emailSent: boolean;
  qrCode: string;
  status?: string;
}

const Reservations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/reservations")
      .then((r) => r.json())
      .then((data) => mounted && setReservations(data))
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const filteredReservations = reservations.filter(
    (res) =>
      res.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.stalls.some((stall) => stall.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const performReservationAction = async (id: string, action: "approve" | "decline") => {
    setActionLoading((p) => ({ ...p, [id]: true }));
    try {
      const res = await fetch(`/api/reservations/${id}/${action}`, { method: "POST" });
      if (res.ok) {
        const updated = await res.json().catch(() => null);
        if (updated && updated.id) {
          setReservations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        } else {
          setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: action === "approve" ? "confirmed" : "declined" } : r)));
        }
      } else {
        const text = await res.text().catch(() => "");
        window.alert(`Failed to ${action} reservation: ${text || res.statusText}`);
      }
    } catch (err) {
      window.alert("Error performing action.");
    } finally {
      setActionLoading((p) => {
        const copy = { ...p };
        delete copy[id];
        return copy;
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Reservations</h2>
          <p className="text-muted-foreground">
            Manage and view all stall reservations
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Reservations</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by publisher, email, or stall..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Publisher/Vendor</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Stalls</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Email Status</TableHead>
                  <TableHead>QR Code</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">Loading...</TableCell>
                  </TableRow>
                ) : (
                  filteredReservations.map((reservation) => {
                    return (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">{reservation.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{reservation.publisher}</div>
                            <div className="text-sm text-muted-foreground">{reservation.email}</div>
                            <div className="text-sm text-muted-foreground mt-1">Status: {reservation.status ?? "pending"}</div>
                          </div>
                        </TableCell>
                        <TableCell>{reservation.contact}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {reservation.stalls.map((stall) => (
                              <Badge key={stall} variant="secondary">
                                {stall}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{reservation.genre}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {reservation.emailSent ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-600">Sent</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-destructive" />
                                <span className="text-sm text-destructive">Pending</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{reservation.qrCode}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 items-center">
                            <Button size="sm" variant="outline">
                              <Mail className="h-4 w-4 mr-1" />
                              Email
                            </Button>
                            <Button size="sm" variant="outline">
                              <QrCode className="h-4 w-4 mr-1" />
                              QR
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={!!actionLoading[reservation.id] || reservation.status === "confirmed"}
                              onClick={() => performReservationAction(reservation.id, "approve")}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={!!actionLoading[reservation.id] || reservation.status === "declined"}
                              onClick={() => performReservationAction(reservation.id, "decline")}
                            >
                              Decline
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reservations;
