import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Mail,
  ExternalLink,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { ApiService } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Business {
  businessId: number;
  name: string;
  registrationNumber: string;
  contactNumber: string;
  address: string;
  createdAt: string;
  verified: boolean;
}

interface Vendor {
  id: string;
  name: string;
  contact: string;
  email?: string;
  stalls: string[];
  registrationNumber?: string;
  address?: string;
  verified?: boolean;
}

const Vendors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    contactNumber: "",
    address: "",
  });
  const itemsPerPage = 8;

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetchBusinesses = async () => {
      try {
        const businesses = await ApiService.get<Business[]>("/business");

        // Transform Business to Vendor format
        const transformedVendors: Vendor[] = businesses.map((business) => ({
          id: `B${business.businessId}`,
          name: business.name,
          contact: business.contactNumber,
          email: "", // Backend doesn't provide email in response
          stalls: [], // Will be fetched separately or from reservations
          registrationNumber: business.registrationNumber,
          address: business.address,
          verified: business.verified,
        }));

        if (mounted) {
          setVendors(transformedVendors);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch businesses";
        toast.error(message);
        console.error("Failed to fetch businesses:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBusinesses();

    return () => {
      mounted = false;
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.contactNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const newBusiness: Partial<Business> = {
        name: formData.name,
        contactNumber: formData.contactNumber,
        registrationNumber: formData.registrationNumber,
        address: formData.address,
        verified: false,
      };

      const created = await ApiService.post<Business>("/business", newBusiness);

      const vendor: Vendor = {
        id: `B${created.businessId}`,
        name: created.name,
        contact: created.contactNumber,
        email: "",
        stalls: [],
        registrationNumber: created.registrationNumber,
        address: created.address,
        verified: created.verified,
      };

      // Add new business at the top
      setVendors((prev) => [vendor, ...prev]);
      // Reset to first page to show new business
      setCurrentPage(1);
      toast.success("Business created successfully");

      // Reset form
      setFormData({
        name: "",
        registrationNumber: "",
        contactNumber: "",
        address: "",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create business";
      toast.error(message);
      console.error("Failed to create business:", error);
    }
  };

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.stalls.some((stall) =>
        stall.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVendors = filteredVendors.slice(startIndex, endIndex);

  // Reset to first page if current page exceeds total pages
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Businesses
          </h2>
          <p className="text-muted-foreground">
            See all registered businesses and their stall assignments
          </p>
        </div>

        <Card>
          <form onSubmit={handleCreate} className="p-4 border-b">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
              <div>
                <label className="text-sm text-muted-foreground">
                  Business Name
                </label>
                <Input
                  placeholder="Business name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  Registration Number
                </label>
                <Input
                  placeholder="Registration number"
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  Contact Number
                </label>
                <Input
                  placeholder="Contact number"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNumber: e.target.value })
                  }
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-muted-foreground">Address</label>
                <Input
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
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
                  <TableHead>Business Name</TableHead>
                  <TableHead>Registration #</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground"
                    >
                      Loading businesses...
                    </TableCell>
                  </TableRow>
                ) : filteredVendors.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground"
                    >
                      No businesses found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedVendors.map((vendor) => {
                    return (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-medium">
                          {vendor.id}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{vendor.name}</div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {vendor.registrationNumber}
                        </TableCell>
                        <TableCell className="text-sm">
                          {vendor.contact}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {vendor.address || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={vendor.verified ? "default" : "outline"}
                          >
                            {vendor.verified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Mail className="h-4 w-4 mr-1" />
                              Contact
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

          {/* Pagination Controls */}
          {filteredVendors.length > 0 && (
            <div className="border-t px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-foreground">
                    {Math.min(endIndex, filteredVendors.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {filteredVendors.length}
                  </span>{" "}
                  businesses
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={
                            currentPage === page ? "w-8 h-8 p-0" : "w-8 h-8 p-0"
                          }
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Vendors;
