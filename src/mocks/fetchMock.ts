import { mockProfile, mockReservations, mockStalls, mockVendors, mockDashboard } from "@/test";

// Simple in-browser fetch interceptor to provide mock REST responses for /api/* endpoints.
// This runs in the browser environment and should be imported once (e.g. in main.tsx).

const originalFetch = window.fetch.bind(window);

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
        const method = (init && init.method ? String(init.method) : "GET").toUpperCase();

        // Support basic CRUD for profile in the mock: GET and PUT/PATCH/POST to update in-memory mockProfile
        if (path === "profile") {
          if (method === "GET") return jsonResponse(mockProfile);

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

          return jsonResponse({ message: "Method not implemented in mock for profile." }, 405);
        }

        // Only support GET for other endpoints by default
        if (method !== "GET") {
          return jsonResponse({ message: "Method not implemented in mock." }, 405);
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
