import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StallSize = "small" | "medium" | "large";
type StallStatus = "available" | "reserved";

/**
 * Stall model used on the Stall Map page
 */
interface Stall {
  id: string;
  size: StallSize;
  status: StallStatus;
  publisher?: string;
}

/**
 * Page: StallMap
 * Shows a venue map of stalls and provides an assign-stall form.
 * All logic remains unchanged — this comment and formatting are non-functional.
 */
const StallMap = () => {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedType, setSelectedType] = useState<StallSize | "">("");
  const [selectedStallId, setSelectedStallId] = useState<string>("");
  const [selectedVendorId, setSelectedVendorId] = useState<string>("");
  const [assignLoading, setAssignLoading] = useState(false);

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

  // fetch vendors for dropdown
  useEffect(() => {
    let mounted = true;
    fetch("/api/vendors")
      .then((r) => {
        if (!r.ok) throw new Error("failed to fetch vendors");
        return r.json();
      })
      .then((data) => {
        if (mounted) setVendors(data || []);
      })
      .catch(() => {
        if (mounted) setVendors([]);
      });
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

  const assignStall = async () => {
    if (!selectedStallId || !selectedVendorId) {
      window.alert("Please select stall and vendor to assign.");
      return;
    }
    setAssignLoading(true);
    try {
      // Assumption: API endpoint to assign a stall is POST /api/stalls/{id}/assign
      // with JSON body { vendorId }
      const res = await fetch(`/api/stalls/${selectedStallId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId: selectedVendorId }),
      });

      if (res.ok) {
        // If API returns updated stall object, use it; otherwise fall back to updating locally
        const updated = await res.json().catch(() => null);
        if (updated && updated.id) {
          setStalls((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        } else {
          // Find vendor name for local display
          const vendorName = vendors.find((v) => v.id === selectedVendorId)?.name ?? selectedVendorId;
          setStalls((prev) =>
            prev.map((s) =>
              s.id === selectedStallId ? { ...s, status: "reserved", publisher: vendorName } : s
            )
          );
        }

        // keep UI consistent by re-fetching stalls (best-effort)
        fetch("/api/stalls")
          .then((r) => r.json())
          .then((data) => setStalls(data))
          .catch(() => {});

        window.alert("Stall assigned successfully.");
        // reset selections
        setSelectedType("");
        setSelectedStallId("");
        setSelectedVendorId("");
      } else {
        const text = await res.text().catch(() => "");
        window.alert("Failed to assign stall: " + (text || res.statusText));
      }
    } catch (err) {
      window.alert("Error assigning stall.");
    } finally {
      setAssignLoading(false);
    }
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

        {/* Assign Stall Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Assign Stall</span>
              <Badge variant="outline">Quick assign</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3 md:items-end">
              <div className="flex flex-col">
                <label className="text-sm text-muted-foreground mb-1">Stall type</label>
                <select
                  className="border rounded px-3 py-2 bg-background"
                  value={selectedType}
                  onChange={(e) => {
                    const val = e.target.value as StallSize | "";
                    setSelectedType(val);
                    setSelectedStallId("");
                  }}
                >
                  <option value="">Select size</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-muted-foreground mb-1">Stall ID</label>
                <select
                  className="border rounded px-3 py-2 bg-background min-w-[160px]"
                  value={selectedStallId}
                  onChange={(e) => setSelectedStallId(e.target.value)}
                >
                  <option value="">Select stall</option>
                  {stalls
                    .filter((s) => (selectedType ? s.size === selectedType : true))
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id} {s.status === "reserved" ? `(reserved)` : ""}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-muted-foreground mb-1">Vendor</label>
                <select
                  className="border rounded px-3 py-2 bg-background min-w-[200px]"
                  value={selectedVendorId}
                  onChange={(e) => setSelectedVendorId(e.target.value)}
                >
                  <option value="">Select vendor</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  className="px-4 py-2 rounded bg-accent text-white disabled:opacity-50"
                  onClick={assignStall}
                  disabled={assignLoading || !selectedStallId || !selectedVendorId}
                >
                  {assignLoading ? "Assigning..." : "Assign Stall"}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

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
