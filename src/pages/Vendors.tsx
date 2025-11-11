import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Mail, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Vendor {
  id: string;
  name: string;
  contact: string;
  email: string;
  stalls: string[];
  category: string;
}

const Vendors = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock vendor data
  const vendors: Vendor[] = [
    {
      id: "V001",
      name: "Sarasavi Bookshop",
      contact: "+94 77 123 4567",
      email: "info@sarasavi.lk",
      stalls: ["A12", "A13"],
      category: "General Books",
    },
    {
      id: "V002",
      name: "Vijitha Yapa",
      contact: "+94 77 234 5678",
      email: "contact@vijithayapa.com",
      stalls: ["B05"],
      category: "Academic",
    },
    {
      id: "V003",
      name: "Godage Publishers",
      contact: "+94 77 345 6789",
      email: "info@godagepublishers.lk",
      stalls: ["C20", "C21", "C22"],
      category: "Literature",
    },
  ];

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.stalls.some((stall) => stall.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Vendors</h2>
          <p className="text-muted-foreground">See all registered vendors and their stall assignments</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Vendors</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, or stall..."
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
                  <TableHead>Vendor</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Stalls</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vendor.name}</div>
                        <div className="text-sm text-muted-foreground">{vendor.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{vendor.contact}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {vendor.stalls.map((stall) => (
                          <Badge key={stall} variant="secondary">
                            {stall}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{vendor.category}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
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

export default Vendors;
