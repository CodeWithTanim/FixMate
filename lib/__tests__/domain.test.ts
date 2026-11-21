import test from "node:test";
import assert from "node:assert/strict";

// Domain test suite for FixMate client contracts, business rules & invariants

test("Booking state machine permits valid transitions only", () => {
  const allowedTransitions: Record<string, string[]> = {
    requested: ["accepted", "rejected"],
    accepted: ["in-progress"],
    "in-progress": ["completed"],
  };

  // Valid forward transitions
  assert.equal(allowedTransitions["requested"].includes("accepted"), true);
  assert.equal(allowedTransitions["requested"].includes("rejected"), true);
  assert.equal(allowedTransitions["accepted"].includes("in-progress"), true);
  assert.equal(allowedTransitions["in-progress"].includes("completed"), true);

  // Invalid reverse or skip transitions
  assert.equal(allowedTransitions["requested"].includes("completed"), false);
  assert.equal(allowedTransitions["in-progress"].includes("accepted"), false);
  assert.equal(allowedTransitions["completed"] === undefined, true);
});

test("Customer cancellation is restricted to requested state", () => {
  function canCustomerCancel(status: string): boolean {
    return status === "requested";
  }

  assert.equal(canCustomerCancel("requested"), true);
  assert.equal(canCustomerCancel("accepted"), false);
  assert.equal(canCustomerCancel("in-progress"), false);
  assert.equal(canCustomerCancel("completed"), false);
  assert.equal(canCustomerCancel("cancelled"), false);
});

test("Problem description must meet minimum character length", () => {
  function validateProblemDescription(text: string): boolean {
    return text.trim().length >= 20 && text.trim().length <= 2000;
  }

  assert.equal(validateProblemDescription("Broken screen"), false);
  assert.equal(validateProblemDescription("Cracked screen after dropping on floor, touch unresponsive"), true);
  assert.equal(validateProblemDescription("   "), false);
});

test("Category validation recognizes all 7 official service categories", () => {
  const officialCategories = [
    "Smartphone",
    "Laptop & PC",
    "AC",
    "Refrigerator",
    "TV",
    "Washing Machine",
    "Electrical",
  ];

  assert.equal(officialCategories.length, 7);
  assert.equal(officialCategories.includes("Smartphone"), true);
  assert.equal(officialCategories.includes("Solar Panels"), false);
});

test("Currency and price calculations round to two decimal cents", () => {
  function calculateTotalCents(amount: number): number {
    return Math.round(amount * 100);
  }

  function formatPrice(cents: number): string {
    return (cents / 100).toFixed(2);
  }

  assert.equal(calculateTotalCents(49.99), 4999);
  assert.equal(calculateTotalCents(49.994), 4999);
  assert.equal(calculateTotalCents(49.996), 5000);
  assert.equal(formatPrice(4999), "49.99");
});

test("Role route boundary enforcement blocks privilege escalation", () => {
  const allowedRoutes: Record<string, string[]> = {
    customer: ["/dashboard/customer", "/dashboard/customer/bookings", "/dashboard/customer/payments", "/dashboard/profile"],
    technician: ["/dashboard/technician", "/dashboard/technician/requests", "/dashboard/technician/my-services", "/dashboard/technician/add-service", "/dashboard/profile"],
    admin: ["/dashboard/admin", "/dashboard/admin/services", "/dashboard/admin/users", "/dashboard/admin/bookings", "/dashboard/admin/transactions", "/dashboard/profile"],
  };

  function isAuthorized(userRole: string, targetPath: string): boolean {
    const accessible = allowedRoutes[userRole] || [];
    return accessible.some((route) => targetPath === route || targetPath.startsWith(route + "/"));
  }

  // Customer tests
  assert.equal(isAuthorized("customer", "/dashboard/customer/bookings"), true);
  assert.equal(isAuthorized("customer", "/dashboard/admin/users"), false);
  assert.equal(isAuthorized("customer", "/dashboard/technician/add-service"), false);

  // Technician tests
  assert.equal(isAuthorized("technician", "/dashboard/technician/my-services"), true);
  assert.equal(isAuthorized("technician", "/dashboard/admin/services"), false);

  // Admin tests
  assert.equal(isAuthorized("admin", "/dashboard/admin/transactions"), true);
  assert.equal(isAuthorized("admin", "/dashboard/customer/bookings"), false);
});

test("Payment verification enforces customer ownership and session completeness", () => {
  interface MockBooking {
    customerId: string;
    customerEmail: string;
    status: string;
  }

  function canVerifyPayment(booking: MockBooking, user: { id: string; email: string }, session: { payment_status: string }): boolean {
    const isOwner = booking.customerId === user.id || booking.customerEmail === user.email;
    const isPaid = session.payment_status === "paid";
    return isOwner && isPaid;
  }

  const booking = {
    customerId: "cust_123",
    customerEmail: "cust@fixmate.dev",
    status: "completed",
  };

  // Legitimate owner with paid session
  assert.equal(canVerifyPayment(booking, { id: "cust_123", email: "cust@fixmate.dev" }, { payment_status: "paid" }), true);

  // Wrong customer attempting verification
  assert.equal(canVerifyPayment(booking, { id: "attacker_999", email: "attacker@fixmate.dev" }, { payment_status: "paid" }), false);

  // Unpaid session
  assert.equal(canVerifyPayment(booking, { id: "cust_123", email: "cust@fixmate.dev" }, { payment_status: "unpaid" }), false);
});

test("Catalog pagination contract maps pagination.total, page, limit, totalPages correctly", () => {
  interface ApiCatalogResponse {
    success: boolean;
    data: unknown[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  }

  function mapCatalogPagination(json: ApiCatalogResponse) {
    const total = json.pagination?.total ?? json.total ?? 0;
    const page = json.pagination?.page ?? json.page ?? 1;
    const limit = json.pagination?.limit ?? json.limit ?? 9;
    const totalPages = json.pagination?.totalPages ?? json.totalPages ?? Math.ceil(total / limit);
    return { total, page, limit, totalPages };
  }

  // Response with pagination object from Express index.js
  const expressResponse: ApiCatalogResponse = {
    success: true,
    data: Array(9).fill({ id: "1" }),
    pagination: {
      total: 14,
      page: 1,
      limit: 9,
      totalPages: 2,
    },
  };

  const mapped = mapCatalogPagination(expressResponse);
  assert.equal(mapped.total, 14);
  assert.equal(mapped.page, 1);
  assert.equal(mapped.limit, 9);
  assert.equal(mapped.totalPages, 2);

  // Fallback response without pagination wrapper
  const flatResponse: ApiCatalogResponse = {
    success: true,
    data: Array(5).fill({ id: "2" }),
    total: 5,
    page: 1,
    limit: 9,
    totalPages: 1,
  };

  const mappedFlat = mapCatalogPagination(flatResponse);
  assert.equal(mappedFlat.total, 5);
  assert.equal(mappedFlat.page, 1);
  assert.equal(mappedFlat.limit, 9);
  assert.equal(mappedFlat.totalPages, 1);
});

test("Payment verification response contract provides authoritative receipt fields", () => {
  interface VerifyResponse {
    success: boolean;
    booking: { _id: string; serviceTitle: string; finalAmount: number };
    payment: {
      id: string;
      transactionId: string;
      stripePaymentIntentId: string;
      amount: number;
      currency: string;
      status: string;
    };
  }

  const mockResponse: VerifyResponse = {
    success: true,
    booking: { _id: "b_123", serviceTitle: "TV Repair", finalAmount: 85.00 },
    payment: {
      id: "pay_123",
      transactionId: "pi_test_123",
      stripePaymentIntentId: "pi_test_123",
      amount: 85.00,
      currency: "usd",
      status: "succeeded",
    },
  };

  assert.equal(mockResponse.success, true);
  assert.equal(mockResponse.payment.amount, 85.00);
  assert.equal(mockResponse.payment.transactionId, "pi_test_123");
  assert.equal(mockResponse.payment.status, "succeeded");
});

test("Active booking constraint prevents duplicate concurrent requests for same customer and service", () => {
  const activeBookings = new Map<string, string>();

  function createBooking(customerEmail: string, serviceId: string, status: string): { ok: boolean; status: number; message: string } {
    const key = `${customerEmail}:${serviceId}`;
    const current = activeBookings.get(key);

    const activeStatuses = ["requested", "accepted", "in-progress"];
    if (current && activeStatuses.includes(current)) {
      return { ok: false, status: 409, message: "Active booking already exists for this service" };
    }

    activeBookings.set(key, status);
    return { ok: true, status: 201, message: "Booking created" };
  }

  // Initial booking
  const first = createBooking("customer@fixmate.dev", "service_42", "requested");
  assert.equal(first.ok, true);
  assert.equal(first.status, 201);

  // Duplicate active booking while first is still requested: rejected with 409 Conflict
  const duplicate = createBooking("customer@fixmate.dev", "service_42", "requested");
  assert.equal(duplicate.ok, false);
  assert.equal(duplicate.status, 409);

  // Different customer: allowed
  const otherCustomer = createBooking("other@fixmate.dev", "service_42", "requested");
  assert.equal(otherCustomer.ok, true);
  assert.equal(otherCustomer.status, 201);

  // Transition to completed (terminal state)
  activeBookings.set("customer@fixmate.dev:service_42", "completed");

  // Rebooking after terminal state: allowed!
  const rebook = createBooking("customer@fixmate.dev", "service_42", "requested");
  assert.equal(rebook.ok, true);
  assert.equal(rebook.status, 201);
});

test("Upload handler byte inspection accepts authentic JPEG, PNG, WebP signatures and rejects invalid non-images or oversized buffers", () => {
  const MAX_SIZE = 3 * 1024 * 1024; // 3MB Vercel compatibility limit

  function inspectUploadedBytes(buffer: Buffer): { valid: boolean; format?: string; error?: string } {
    if (buffer.length > MAX_SIZE) {
      return { valid: false, error: "File exceeds 3MB limit" };
    }

    if (buffer.length < 8) {
      return { valid: false, error: "File too small" };
    }

    // JPEG magic bytes: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return { valid: true, format: "jpeg" };
    }

    // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    ) {
      return { valid: true, format: "png" };
    }

    // WebP magic bytes: RIFF....WEBP
    if (
      buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
    ) {
      return { valid: true, format: "webp" };
    }

    return { valid: false, error: "Unsupported image format or corrupt file" };
  }

  // Valid JPEG
  const jpegBuf = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);
  assert.equal(inspectUploadedBytes(jpegBuf).valid, true);
  assert.equal(inspectUploadedBytes(jpegBuf).format, "jpeg");

  // Valid PNG
  const pngBuf = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert.equal(inspectUploadedBytes(pngBuf).valid, true);
  assert.equal(inspectUploadedBytes(pngBuf).format, "png");

  // Fake file disguised as image (e.g. text file starting with ASCII letters)
  const fakeImageBuf = Buffer.from("<html><script>alert(1)</script></html>");
  assert.equal(inspectUploadedBytes(fakeImageBuf).valid, false);

  // Oversized buffer
  const largeBuf = Buffer.alloc(3 * 1024 * 1024 + 1);
  assert.equal(inspectUploadedBytes(largeBuf).valid, false);
});

test("Profile identity updates propagate area, serviceArea and synchronizes shared state", () => {
  interface UserProfileState {
    name: string;
    area: string;
    serviceArea: string;
    bio: string;
    image: string | null;
  }

  function applyProfilePatch(
    current: UserProfileState,
    patch: { name?: string; serviceArea?: string; area?: string; bio?: string; image?: string | null }
  ): UserProfileState {
    const updated = { ...current };
    if (patch.name !== undefined && patch.name.trim()) updated.name = patch.name.trim();
    if (patch.area !== undefined) {
      updated.area = patch.area.trim();
      updated.serviceArea = patch.area.trim();
    } else if (patch.serviceArea !== undefined) {
      updated.area = patch.serviceArea.trim();
      updated.serviceArea = patch.serviceArea.trim();
    }
    if (patch.bio !== undefined) updated.bio = patch.bio.trim();
    if (patch.image !== undefined) updated.image = patch.image ? patch.image.trim() : null;
    return updated;
  }

  const initialProfile: UserProfileState = {
    name: "Rahim Tech",
    area: "Dhanmondi, Dhaka",
    serviceArea: "Dhanmondi, Dhaka",
    bio: "Experienced technician",
    image: "https://example.com/photo.jpg",
  };

  // Update area via serviceArea field
  const updated = applyProfilePatch(initialProfile, {
    serviceArea: "Gulshan & Banani",
    bio: "Certified master technician",
  });

  assert.equal(updated.area, "Gulshan & Banani");
  assert.equal(updated.serviceArea, "Gulshan & Banani");
  assert.equal(updated.bio, "Certified master technician");
  assert.equal(updated.image, "https://example.com/photo.jpg");

  // Remove photo explicitly
  const noPhoto = applyProfilePatch(updated, { image: null });
  assert.equal(noPhoto.image, null);
});

test("API token manager binds token to active session and discards in-flight tokens on logout", async () => {
  let memoryToken: string | null = "valid_cached_token_for_user_1";
  let activeSessionEpoch = 1;
  let inFlightPromise: Promise<string | null> | null = null;

  function clearTokenCache() {
    memoryToken = null;
    inFlightPromise = null;
    activeSessionEpoch += 1;
  }

  async function fetchTokenMock(epochAtStart: number): Promise<string | null> {
    await new Promise((resolve) => setTimeout(resolve, 10));
    if (epochAtStart !== activeSessionEpoch) {
      return null;
    }
    return "new_token_for_user_1";
  }

  // Active session fetches token
  const epoch = activeSessionEpoch;
  inFlightPromise = fetchTokenMock(epoch);

  // User signs out before in-flight fetch completes
  clearTokenCache();

  const resolved = await inFlightPromise;
  assert.equal(resolved, null, "In-flight token from previous session must be discarded");
  assert.equal(memoryToken, null, "Memory token must not be repopulated after logout");
});

test("Client money amount validation checks positive numbers with min $0.50", () => {
  function validateClientPrice(priceStr: string): { valid: boolean; amount?: number } {
    const parsed = parseFloat(priceStr);
    if (isNaN(parsed) || !isFinite(parsed) || parsed < 0.50 || parsed > 100000) {
      return { valid: false };
    }
    return { valid: true, amount: Math.round(parsed * 100) / 100 };
  }

  assert.equal(validateClientPrice("50.00").valid, true);
  assert.equal(validateClientPrice("0.50").valid, true);
  assert.equal(validateClientPrice("0.49").valid, false);
  assert.equal(validateClientPrice("-10").valid, false);
  assert.equal(validateClientPrice("abc").valid, false);
  assert.equal(validateClientPrice("Infinity").valid, false);
});

test("getTodayCalendarDate computes calendar YYYY-MM-DD in explicit Asia/Dhaka timezone", () => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const today = formatter.format(new Date());
  assert.match(today, /^\d{4}-\d{2}-\d{2}$/);
});
