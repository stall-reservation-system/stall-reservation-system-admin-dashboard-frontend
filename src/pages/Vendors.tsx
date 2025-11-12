import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Mail, ExternalLink, Plus } from "lucide-react";
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
}

const Vendors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const contactRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/vendors")
      .then((r) => r.json())
      .then((data) => mounted && setVendors(data))
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value || "";
    const email = emailRef.current?.value || "";
    const contact = contactRef.current?.value || "";
    const payload = { name, email, contact };

    try {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        setVendors((prev) => [...prev, created]);
        // clear form
        if (nameRef.current) nameRef.current.value = "";
        if (emailRef.current) emailRef.current.value = "";
        if (contactRef.current) contactRef.current.value = "";
      } else {
        console.error("Failed to create business", await res.text());
      }
    } catch (err) {
      console.error(err);
    }
  };

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
          <h2 className="text-3xl font-bold text-foreground mb-2">Businesses</h2>
          <p className="text-muted-foreground">See all registered businesses and their stall assignments</p>
        </div>

        <Card>
          <form onSubmit={handleCreate} className="p-4 border-b">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
              <div className="md:col-span-2">
                <label className="text-sm text-muted-foreground">Name</label>
                <Input ref={nameRef} placeholder="Business name" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <Input ref={emailRef} placeholder="Email" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Contact</label>
                <Input ref={contactRef} placeholder="Contact" />
              </div>
              <div className="flex items-center">
                <Button type="submit" className="w-full" variant="secondary">
                  <Plus className="mr-2 h-4 w-4" /> Add Business
                </Button>
              </div>
            </div>
          </form>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Businesses</CardTitle>
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
                  <TableHead>Business</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Stalls</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">Loading...</TableCell>
                  </TableRow>
                ) : (
                  filteredVendors.map((vendor) => {
                    return (
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

export default Vendors;
