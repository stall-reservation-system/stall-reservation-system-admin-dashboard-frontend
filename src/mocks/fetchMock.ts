import {
  mockProfile,
  mockReservations,
  mockStalls,
  mockVendors,
  mockDashboard,
} from "@/test";
import { transformApiUserToProfile } from "@/utils/profileTransform";

// Simple in-browser fetch interceptor to provide mock REST responses for /api/* endpoints.
// This runs in the browser environment and should be imported once (e.g. in main.tsx).

const originalFetch = window.fetch.bind(window);

// Store current authenticated user for profile endpoint
let currentAuthenticatedUser: any = null;

// Export function to update authenticated user (called from AuthContext)
export const setMockAuthenticatedUser = (user: any) => {
  currentAuthenticatedUser = user;
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// small artificial delay to simulate network
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

window.fetch = async (input: RequestInfo, init?: RequestInit) => {
  try {
    const url = typeof input === "string" ? input : input.url;

    if (url.startsWith("/api/")) {
      // mimic network latency
      await delay(150);

      const path = url.replace("/api/", "").split(/[?#]/)[0];
      const method = (
        init && init.method ? String(init.method) : "GET"
      ).toUpperCase();

      // Support basic CRUD for profile in the mock: GET and PUT/PATCH/POST to update in-memory mockProfile
      if (path === "profile") {
        if (method === "GET") {
          // If user is authenticated, return their transformed profile
          if (currentAuthenticatedUser) {
            const userProfile = transformApiUserToProfile(
              currentAuthenticatedUser
            );
            return jsonResponse(userProfile);
          }
          // Otherwise return mock profile
          return jsonResponse(mockProfile);
        }

        if (method === "PUT" || method === "PATCH" || method === "POST") {
          try {
            const bodyText = init && init.body ? String(init.body) : null;
            const body = bodyText ? JSON.parse(bodyText) : {};
            // mutate the exported mockProfile object so other modules see updates
            Object.assign(mockProfile, body);
            // notify success
            return jsonResponse(mockProfile);
          } catch (err) {
            return jsonResponse({ message: "Invalid JSON body" }, 400);
          }
        }

        return jsonResponse(
          { message: "Method not implemented in mock for profile." },
          405
        );
      }

      // Support creating vendors via POST /api/vendors
      if (path === "vendors") {
        if (method === "GET") return jsonResponse(mockVendors);
        if (method === "POST") {
          try {
            const bodyText = init && init.body ? String(init.body) : null;
            const body = bodyText ? JSON.parse(bodyText) : {};
            // ensure stalls is array
            let stalls = [] as string[];
            if (Array.isArray(body.stalls)) stalls = body.stalls;
            else if (typeof body.stalls === "string")
              stalls = body.stalls
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean);

            // create id V###
            const nextIdNum = mockVendors.length + 1;
            const id = `V${String(nextIdNum).padStart(3, "0")}`;
            const vendor = {
              id,
              name: body.name || "",
              contact: body.contact || "",
              email: body.email || "",
              stalls,
              category: body.category || "",
            };
            mockVendors.push(vendor as any);
            return jsonResponse(vendor, 201);
          } catch (err) {
            return jsonResponse({ message: "Invalid JSON body" }, 400);
          }
        }

        return jsonResponse(
          { message: "Method not implemented in mock for vendors." },
          405
        );
      }

      // Support assigning a stall: POST /api/stalls/{id}/assign
      if (
        path.startsWith("stalls/") &&
        method === "POST" &&
        path.endsWith("/assign")
      ) {
        try {
          const parts = path.split("/"); // ["stalls", "{id}", "assign"]
          const stallId = parts[1];
          const bodyText = init && init.body ? String(init.body) : null;
          const body = bodyText ? JSON.parse(bodyText) : {};
          const vendorId = body.vendorId;

          // find vendor name from mockVendors if possible
          const vendor = mockVendors.find((v) => v.id === vendorId);
          const vendorName = vendor ? vendor.name : vendorId || "";

          // find the stall in mockStalls and update
          const stall = (mockStalls as any).find((s: any) => s.id === stallId);
          if (!stall) return jsonResponse({ message: "Stall not found" }, 404);

          stall.status = "reserved";
          stall.publisher = vendorName;

          return jsonResponse(stall, 200);
        } catch (err) {
          return jsonResponse({ message: "Invalid JSON body" }, 400);
        }
      }

      // Only support GET for other endpoints by default
      if (method !== "GET") {
        return jsonResponse(
          { message: "Method not implemented in mock." },
          405
        );
      }

      switch (path) {
        case "reservations":
          return jsonResponse(mockReservations);
        case "dashboard":
          return jsonResponse(mockDashboard);
        case "stalls":
          return jsonResponse(mockStalls);
        case "vendors":
          return jsonResponse(mockVendors);
        default:
          return jsonResponse({ message: "Not found" }, 404);
      }
    }

    // non-mocked URL, fallback to original
    return originalFetch(input, init);
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
};

export {};
