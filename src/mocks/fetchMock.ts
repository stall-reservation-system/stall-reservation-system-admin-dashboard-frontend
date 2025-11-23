import {
  mockProfile,
  mockReservations,
  mockStalls,
  mockVendors,
  mockBusinesses,
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

      // Support business endpoints: GET /api/business/all
      if (path === "business/all") {
        if (method === "GET") {
          return jsonResponse(mockBusinesses);
        }
        return jsonResponse(
          { message: "Method not implemented in mock for business/all." },
          405
        );
      }

      // Support creating businesses via POST /api/business
      if (path === "business") {
        if (method === "POST") {
          try {
            const bodyText = init && init.body ? String(init.body) : null;
            const body = bodyText ? JSON.parse(bodyText) : {};

            // Generate new businessId
            const nextId =
              Math.max(...mockBusinesses.map((b: any) => b.businessId), 0) + 1;

            const newBusiness = {
              businessId: nextId,
              name: body.name || "",
              registrationNumber: body.registrationNumber || "",
              contactNumber: body.contactNumber || "",
              address: body.address || "",
              createdAt: new Date().toISOString(),
              verified: false,
            };

            mockBusinesses.push(newBusiness as any);
            return jsonResponse(newBusiness, 201);
          } catch (err) {
            return jsonResponse({ message: "Invalid JSON body" }, 400);
          }
        }
        return jsonResponse(
          { message: "Method not implemented in mock for business." },
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

      // Support reservation actions: POST /api/reservations/{id}/approve or /decline
      if (path.startsWith("reservations/") && method === "POST") {
        try {
          const parts = path.split("/"); // ["reservations", "{id}", "approve"|"decline"]
          const resId = parts[1];
          const action = parts[2];

          const reservation = mockReservations.find((r) => r.id === resId);
          if (!reservation)
            return jsonResponse({ message: "Reservation not found" }, 404);

          if (action === "approve") {
            reservation.status = "confirmed";
            reservation.emailSent = true;
          } else if (action === "decline") {
            reservation.status = "declined";
          } else {
            return jsonResponse({ message: "Action not implemented" }, 405);
          }

          return jsonResponse(reservation, 200);
        } catch (err) {
          return jsonResponse({ message: "Invalid request" }, 400);
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
        case "business/all":
          return jsonResponse(mockBusinesses);
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
