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
      // Only support GET for the mock
      if (init && init.method && init.method.toUpperCase() !== "GET") {
        return jsonResponse({ message: "Method not implemented in mock." }, 405);
      }

      switch (path) {
        case "profile":
          return jsonResponse(mockProfile);
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
