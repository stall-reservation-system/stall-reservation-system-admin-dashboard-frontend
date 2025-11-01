import { useState } from "react";
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
}

const Reservations = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock reservation data
  const reservations: Reservation[] = [
    {
      id: "R001",
      publisher: "Sarasavi Bookshop",
      contact: "+94 77 123 4567",
      email: "info@sarasavi.lk",
      stalls: ["A12", "A13"],
      genre: "General Books",
      emailSent: true,
      qrCode: "QR001",
    },
    {
      id: "R002",
      publisher: "Vijitha Yapa",
      contact: "+94 77 234 5678",
      email: "contact@vijithayapa.com",
      stalls: ["B05"],
      genre: "Academic",
      emailSent: false,
      qrCode: "QR002",
    },
    {
      id: "R003",
      publisher: "Godage Publishers",
      contact: "+94 77 345 6789",
      email: "info@godagepublishers.lk",
      stalls: ["C20", "C21", "C22"],
      genre: "Literature",
      emailSent: true,
      qrCode: "QR003",
    },
    {
      id: "R004",
      publisher: "Piyumi Publishers",
      contact: "+94 77 456 7890",
      email: "piyumi@books.lk",
      stalls: ["A05", "A06"],
      genre: "Children's Books",
      emailSent: true,
      qrCode: "QR004",
    },
    {
      id: "R005",
      publisher: "MD Gunasena",
      contact: "+94 77 567 8901",
      email: "mdg@gunasena.lk",
      stalls: ["B12", "B13"],
      genre: "Educational",
      emailSent: false,
      qrCode: "QR005",
    },
  ];

  const filteredReservations = reservations.filter(
    (res) =>
      res.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.stalls.some((stall) => stall.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">{reservation.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{reservation.publisher}</div>
                        <div className="text-sm text-muted-foreground">{reservation.email}</div>
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
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline">
                          <QrCode className="h-4 w-4 mr-1" />
                          QR
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reservations;
