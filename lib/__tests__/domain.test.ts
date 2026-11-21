import test from "node:test";
import assert from "node:assert/strict";

// Domain test suite for FixMate business rules & invariants

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
  function formatMoney(amount: number): string {
    return `$${(Math.round(amount * 100) / 100).toFixed(2)}`;
  }

  assert.equal(formatMoney(45), "$45.00");
  assert.equal(formatMoney(65.5), "$65.50");
  assert.equal(formatMoney(99.999), "$100.00");
});

test("Role route boundary enforcement blocks privilege escalation", () => {
  function isAuthorized(userRole: string, path: string): boolean {
    if (path.startsWith("/dashboard/customer")) return userRole === "customer";
    if (path.startsWith("/dashboard/technician")) return userRole === "technician";
    if (path.startsWith("/dashboard/admin")) return userRole === "admin";
    return true;
  }

  assert.equal(isAuthorized("customer", "/dashboard/customer/bookings"), true);
  assert.equal(isAuthorized("customer", "/dashboard/admin/users"), false);
  assert.equal(isAuthorized("technician", "/dashboard/technician/requests"), true);
  assert.equal(isAuthorized("technician", "/dashboard/customer/bookings"), false);
  assert.equal(isAuthorized("admin", "/dashboard/admin/transactions"), true);
  assert.equal(isAuthorized("admin", "/dashboard/technician"), false);
});

test("Payment verification enforces customer ownership and session completeness", () => {
  interface PaymentCheck {
    sessionPaid: boolean;
    currency: string;
    bookingCustomerEmail: string;
    reqUserEmail: string;
    bookingStatus: string;
  }

  function validatePaymentFulfillment(check: PaymentCheck): { ok: boolean; reason?: string } {
    if (!check.sessionPaid) return { ok: false, reason: "Session unpaid" };
    if (check.currency.toLowerCase() !== "usd") return { ok: false, reason: "Unsupported currency" };
    if (check.bookingCustomerEmail !== check.reqUserEmail) return { ok: false, reason: "Customer ownership mismatch" };
    if (check.bookingStatus !== "completed") return { ok: false, reason: "Booking not completed" };
    return { ok: true };
  }

  assert.equal(validatePaymentFulfillment({
    sessionPaid: true,
    currency: "usd",
    bookingCustomerEmail: "customer@fixmate.dev",
    reqUserEmail: "customer@fixmate.dev",
    bookingStatus: "completed"
  }).ok, true);

  assert.equal(validatePaymentFulfillment({
    sessionPaid: false,
    currency: "usd",
    bookingCustomerEmail: "customer@fixmate.dev",
    reqUserEmail: "customer@fixmate.dev",
    bookingStatus: "completed"
  }).ok, false);

  assert.equal(validatePaymentFulfillment({
    sessionPaid: true,
    currency: "usd",
    bookingCustomerEmail: "victim@fixmate.dev",
    reqUserEmail: "attacker@fixmate.dev",
    bookingStatus: "completed"
  }).ok, false);
});

// ==========================================
// INTEGRATION TESTS EXERCISING ACTUAL SERVER IMPLEMENTATION
// ==========================================

interface MockBookingDoc {
  _id: unknown;
  serviceId: string;
  serviceTitle: string;
  customerEmail: string;
  status: string;
  basePrice: number;
  finalAmount: number;
  paymentStatus: string;
  statusHistory?: Array<{ status: string; timestamp: Date; note?: string }>;
  [key: string]: unknown;
}

interface MockPaymentDoc {
  stripeSessionId: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
  [key: string]: unknown;
}

test("fulfillPaymentSession implementation rejects non-completed bookings", async () => {
  // Set test environment
  Object.assign(process.env, { NODE_ENV: "test" });
  const { fulfillPaymentSession, setTestDb } = await import("../../../FixMate-Server/index.js");
  const { ObjectId } = await import("mongodb");

  const bookingId = new ObjectId().toString();
  const mockBooking: MockBookingDoc = {
    _id: new ObjectId(bookingId),
    serviceId: "srv_123",
    serviceTitle: "AC Repair",
    customerEmail: "customer@fixmate.dev",
    status: "requested", // NOT completed!
    basePrice: 50,
    finalAmount: 50,
    paymentStatus: "unpaid",
  };

  const paymentsStore: MockPaymentDoc[] = [];
  const mockDb = {
    collection: (name: string) => {
      if (name === "bookings") {
        return {
          findOne: async (q: { _id?: { toString(): string } }) => (q._id?.toString() === bookingId ? mockBooking : null),
          updateOne: async () => ({ matchedCount: 1, modifiedCount: 1 }),
        };
      }
      if (name === "payments") {
        return {
          findOne: async () => null,
          insertOne: async (doc: MockPaymentDoc) => { paymentsStore.push(doc); return { insertedId: "pay_1" }; },
        };
      }
      return {};
    },
  };

  setTestDb(mockDb);

  const session = {
    id: "cs_test_non_completed",
    payment_status: "paid",
    currency: "usd",
    amount_total: 5000,
    metadata: { bookingId },
    client_reference_id: bookingId,
  };

  const result = await fulfillPaymentSession(session);
  assert.equal(result, null, "Should return null and reject payment for non-completed booking");
  assert.equal(paymentsStore.length, 0, "No payment ledger entry should be created");
});

test("fulfillPaymentSession implementation rejects amount mismatch", async () => {
  Object.assign(process.env, { NODE_ENV: "test" });
  const { fulfillPaymentSession, setTestDb } = await import("../../../FixMate-Server/index.js");
  const { ObjectId } = await import("mongodb");

  const bookingId = new ObjectId().toString();
  const mockBooking: MockBookingDoc = {
    _id: new ObjectId(bookingId),
    serviceId: "srv_456",
    serviceTitle: "Laptop Repair",
    customerEmail: "customer@fixmate.dev",
    status: "completed",
    basePrice: 100,
    finalAmount: 100, // Expected $100 = 10000 cents
    paymentStatus: "unpaid",
  };

  const paymentsStore: MockPaymentDoc[] = [];
  const mockDb = {
    collection: (name: string) => {
      if (name === "bookings") {
        return {
          findOne: async (q: { _id?: { toString(): string } }) => (q._id?.toString() === bookingId ? mockBooking : null),
          updateOne: async () => ({ matchedCount: 1, modifiedCount: 1 }),
        };
      }
      if (name === "payments") {
        return {
          findOne: async () => null,
          insertOne: async (doc: MockPaymentDoc) => { paymentsStore.push(doc); return { insertedId: "pay_2" }; },
        };
      }
      return {};
    },
  };

  setTestDb(mockDb);

  const session = {
    id: "cs_test_mismatch",
    payment_status: "paid",
    currency: "usd",
    amount_total: 100, // Only $1 paid for a $100 job!
    metadata: { bookingId },
    client_reference_id: bookingId,
  };

  const result = await fulfillPaymentSession(session);
  assert.equal(result, null, "Should return null and reject payment for underpaid session");
  assert.equal(paymentsStore.length, 0, "No payment ledger entry should be created on amount mismatch");
});

test("fulfillPaymentSession implementation accepts valid payment and enforces single ledger entry", async () => {
  Object.assign(process.env, { NODE_ENV: "test" });
  const { fulfillPaymentSession, setTestDb } = await import("../../../FixMate-Server/index.js");
  const { ObjectId } = await import("mongodb");

  const bookingId = new ObjectId().toString();
  const mockBooking: MockBookingDoc = {
    _id: new ObjectId(bookingId),
    serviceId: "srv_789",
    serviceTitle: "Screen Replacement",
    customerEmail: "customer@fixmate.dev",
    status: "completed",
    basePrice: 85,
    finalAmount: 85,
    paymentStatus: "unpaid",
  };

  const paymentsStore: MockPaymentDoc[] = [];
  const mockDb = {
    collection: (name: string) => {
      if (name === "bookings") {
        return {
          findOne: async (q: { _id?: { toString(): string } }) => {
            if (q._id?.toString() === bookingId) return mockBooking;
            return null;
          },
          updateOne: async (_filter: unknown, update: { $set: { paymentStatus: string } }) => {
            if (mockBooking.paymentStatus !== "paid") {
              mockBooking.paymentStatus = update.$set.paymentStatus;
              return { matchedCount: 1, modifiedCount: 1 };
            }
            return { matchedCount: 0, modifiedCount: 0 };
          },
        };
      }
      if (name === "payments") {
        return {
          findOne: async (q: { bookingId?: string; stripeSessionId?: string }) => {
            if (q.bookingId) return paymentsStore.find((p) => p.bookingId === q.bookingId) || null;
            if (q.stripeSessionId) return paymentsStore.find((p) => p.stripeSessionId === q.stripeSessionId) || null;
            return null;
          },
          insertOne: async (doc: MockPaymentDoc) => {
            // Emulate unique bookingId constraint
            if (paymentsStore.some((p) => p.bookingId === doc.bookingId)) {
              const err = new Error("E11000 duplicate key error") as Error & { code: number };
              err.code = 11000;
              throw err;
            }
            paymentsStore.push(doc);
            return { insertedId: "pay_3" };
          },
        };
      }
      return {};
    },
  };

  setTestDb(mockDb);

  // First session payment: should succeed
  const session1 = {
    id: "cs_test_session_1",
    payment_status: "paid",
    currency: "usd",
    amount_total: 8500, // Exact $85.00
    customer_email: "customer@fixmate.dev",
    metadata: { bookingId },
    client_reference_id: bookingId,
  };

  const result1 = await fulfillPaymentSession(session1);
  assert.ok(result1, "First payment should succeed");
  assert.equal(paymentsStore.length, 1, "Exactly one payment ledger row should exist");
  assert.equal(mockBooking.paymentStatus, "paid", "Booking must be marked paid");

  // Second different session for the SAME booking: must not create second ledger entry!
  const session2 = {
    id: "cs_test_session_2_different",
    payment_status: "paid",
    currency: "usd",
    amount_total: 8500,
    customer_email: "customer@fixmate.dev",
    metadata: { bookingId },
    client_reference_id: bookingId,
  };

  const result2 = await fulfillPaymentSession(session2);
  assert.ok(result2, "Second session returns existing booking idempotently");
  assert.equal(paymentsStore.length, 1, "Payments ledger must still have strictly ONE row for this booking");
});

test("Active booking constraint prevents duplicate concurrent requests for same customer and service", async () => {
  const activeBookings = new Map<string, string>(); // customerEmail:serviceId -> status

  function createBooking(customerEmail: string, serviceId: string, status: string): { ok: boolean; status: number } {
    const key = `${customerEmail}:${serviceId}`;
    const activeStates = ["requested", "accepted", "in-progress"];
    const existing = activeBookings.get(key);

    if (existing && activeStates.includes(existing)) {
      return { ok: false, status: 409 }; // Conflict!
    }

    activeBookings.set(key, status);
    return { ok: true, status: 201 };
  }

  // First active request: accepted
  const first = createBooking("customer@fixmate.dev", "service_42", "requested");
  assert.equal(first.ok, true);
  assert.equal(first.status, 201);

  // Concurrent second active request for same service: must conflict (409)
  const concurrent = createBooking("customer@fixmate.dev", "service_42", "requested");
  assert.equal(concurrent.ok, false);
  assert.equal(concurrent.status, 409);

  // Transition to completed (terminal state)
  activeBookings.set("customer@fixmate.dev:service_42", "completed");

  // Rebooking after terminal state: allowed!
  const rebook = createBooking("customer@fixmate.dev", "service_42", "requested");
  assert.equal(rebook.ok, true);
  assert.equal(rebook.status, 201);
});

test("fulfillPaymentSession reconciles unpaid booking when ledger row exists (interrupted-write recovery)", async () => {
  Object.assign(process.env, { NODE_ENV: "test" });
  const { fulfillPaymentSession, setTestDb } = await import("../../../FixMate-Server/index.js");
  const { ObjectId } = await import("mongodb");

  const bookingId = new ObjectId().toString();
  const mockBooking: MockBookingDoc = {
    _id: new ObjectId(bookingId),
    serviceId: "srv_999",
    serviceTitle: "Refrigerator Compressor Repair",
    customerEmail: "customer@fixmate.dev",
    status: "completed",
    basePrice: 120,
    finalAmount: 120,
    paymentStatus: "unpaid", // Still unpaid because earlier write failed
    statusHistory: [],
  };

  // Pre-existing ledger entry (from prior webhook or initial interrupted write)
  const paymentsStore: MockPaymentDoc[] = [
    {
      stripeSessionId: "cs_prior_settlement_session",
      bookingId,
      amount: 120,
      currency: "usd",
      status: "succeeded",
      createdAt: new Date(),
    },
  ];

  const mockDb = {
    collection: (name: string) => {
      if (name === "bookings") {
        return {
          findOne: async (q: { _id?: { toString(): string } }) => {
            if (q._id?.toString() === bookingId) return mockBooking;
            return null;
          },
          updateOne: async (
            filter: { paymentStatus?: { $ne: string } },
            update: { $set: { paymentStatus: string }; $push?: { statusHistory: { status: string; timestamp: Date; note?: string } } }
          ) => {
            if (filter.paymentStatus?.$ne === "paid" && mockBooking.paymentStatus === "paid") {
              return { matchedCount: 0, modifiedCount: 0 };
            }
            mockBooking.paymentStatus = update.$set.paymentStatus;
            if (update.$push?.statusHistory) {
              mockBooking.statusHistory = mockBooking.statusHistory || [];
              mockBooking.statusHistory.push(update.$push.statusHistory);
            }
            return { matchedCount: 1, modifiedCount: 1 };
          },
        };
      }
      if (name === "payments") {
        return {
          findOne: async (q: { bookingId?: string; stripeSessionId?: string }) => {
            if (q.bookingId) return paymentsStore.find((p) => p.bookingId === q.bookingId) || null;
            if (q.stripeSessionId) return paymentsStore.find((p) => p.stripeSessionId === q.stripeSessionId) || null;
            return null;
          },
          insertOne: async () => {
            throw new Error("Duplicate key or should not insert new row");
          },
        };
      }
      return {};
    },
  };

  setTestDb(mockDb);

  const retrySession = {
    id: "cs_retry_after_interruption",
    payment_status: "paid",
    currency: "usd",
    amount_total: 12000, // $120.00
    customer_email: "customer@fixmate.dev",
    metadata: { bookingId },
    client_reference_id: bookingId,
  };

  const reconciledResult = await fulfillPaymentSession(retrySession);
  assert.ok(reconciledResult, "Fulfillment retry must return the booking");
  assert.equal(reconciledResult.paymentStatus, "paid", "Booking must be reconciled to paid");
  assert.equal(mockBooking.paymentStatus, "paid", "Underlying booking document must be updated to paid");
  assert.equal(paymentsStore.length, 1, "Exactly one ledger row must exist under retry");
  assert.equal(mockBooking.statusHistory?.length, 1, "Exactly one payment timeline entry recorded");

  // Subsequent idempotent call must not duplicate timeline event
  await fulfillPaymentSession(retrySession);
  assert.equal(mockBooking.statusHistory?.length, 1, "Subsequent calls do not append duplicate timeline entries");
});

test("Payment verification rejects invalid or unfulfilled session with 400 Bad Request", () => {
  interface VerifySimulation {
    sessionPaid: boolean;
    fulfillmentSuccess: boolean;
    bookingPaid: boolean;
  }

  function handleVerification(sim: VerifySimulation): { status: number; success: boolean; message: string } {
    if (!sim.sessionPaid) {
      return { status: 400, success: false, message: "Stripe session is not paid" };
    }
    if (!sim.fulfillmentSuccess || !sim.bookingPaid) {
      return {
        status: 400,
        success: false,
        message: "Payment verification failed: session could not be fulfilled due to status or amount mismatch",
      };
    }
    return { status: 200, success: true, message: "Payment verified and booking updated to paid" };
  }

  // Session paid, but fulfillment rejected due to amount mismatch -> returns 400 (never 200 with null!)
  const rejectedFulfillment = handleVerification({ sessionPaid: true, fulfillmentSuccess: false, bookingPaid: false });
  assert.equal(rejectedFulfillment.status, 400);
  assert.equal(rejectedFulfillment.success, false);

  // Unpaid session -> returns 400
  const unpaidSession = handleVerification({ sessionPaid: false, fulfillmentSuccess: false, bookingPaid: false });
  assert.equal(unpaidSession.status, 400);

  // Successfully fulfilled session -> returns 200
  const validPayment = handleVerification({ sessionPaid: true, fulfillmentSuccess: true, bookingPaid: true });
  assert.equal(validPayment.status, 200);
  assert.equal(validPayment.success, true);
});

test("Upload handler byte inspection accepts authentic JPEG, PNG, WebP signatures and rejects invalid non-images or oversized buffers (3MB Vercel boundary)", () => {
  function validateImagePayload(buffer: Buffer, maxSizeBytes: number = 3 * 1024 * 1024): { ok: boolean; reason?: string } {
    if (!buffer || buffer.length === 0) return { ok: false, reason: "Empty buffer" };
    if (buffer.length > maxSizeBytes) return { ok: false, reason: "Size exceeds limit" };

    const isJpeg = buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const isPng = buffer.length > 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    const isWebp =
      buffer.length > 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP";

    if (!isJpeg && !isPng && !isWebp) {
      return { ok: false, reason: "Unsupported image signature" };
    }
    return { ok: true };
  }

  // Authentic JPEG (FF D8 FF)
  const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
  assert.equal(validateImagePayload(jpegBuffer).ok, true);

  // Authentic PNG (89 50 4E 47 ...)
  const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
  assert.equal(validateImagePayload(pngBuffer).ok, true);

  // Authentic WebP (RIFF....WEBP)
  const webpBuffer = Buffer.concat([
    Buffer.from("RIFF", "ascii"),
    Buffer.from([0x20, 0x00, 0x00, 0x00]),
    Buffer.from("WEBP", "ascii"),
    Buffer.from("VP8 ", "ascii"),
  ]);
  assert.equal(validateImagePayload(webpBuffer).ok, true);

  // Fake non-image: HTML/SVG or text
  const textBuffer = Buffer.from("<svg>alert(1)</svg>", "utf-8");
  assert.equal(validateImagePayload(textBuffer).ok, false);
  assert.equal(validateImagePayload(textBuffer).reason, "Unsupported image signature");

  // Empty buffer
  assert.equal(validateImagePayload(Buffer.alloc(0)).ok, false);

  // Buffer within 3MB boundary (2MB) passes
  const valid2MB = Buffer.concat([
    Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
    Buffer.alloc(2 * 1024 * 1024),
  ]);
  assert.equal(validateImagePayload(valid2MB).ok, true);

  // Oversized buffer exceeding 3MB Vercel function payload boundary (3.5MB)
  const oversizedBuffer = Buffer.concat([
    Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
    Buffer.alloc(3.5 * 1024 * 1024),
  ]);
  assert.equal(validateImagePayload(oversizedBuffer).ok, false);
  assert.equal(validateImagePayload(oversizedBuffer).reason, "Size exceeds limit");
});

test("Profile identity updates propagate area, serviceArea and synchronizes shared state", () => {
  interface UserDoc {
    name: string;
    email: string;
    role: string;
    phone?: string;
    area?: string;
    serviceArea?: string;
    image?: string | null;
  }

  function applyProfileUpdate(existing: UserDoc, updates: { name?: string; phone?: string; area?: string; serviceArea?: string; image?: string | null }): UserDoc {
    const resolvedArea = updates.serviceArea !== undefined ? updates.serviceArea : updates.area;
    return {
      ...existing,
      name: updates.name ? updates.name.trim() : existing.name,
      phone: updates.phone !== undefined ? updates.phone.trim() : existing.phone,
      area: resolvedArea !== undefined ? resolvedArea.trim() : existing.area,
      serviceArea: resolvedArea !== undefined ? resolvedArea.trim() : existing.serviceArea,
      image: updates.image !== undefined ? updates.image : existing.image,
    };
  }

  const initialUser: UserDoc = {
    name: "Alex Customer",
    email: "customer@fixmate.dev",
    role: "customer",
    area: "Old Town",
    serviceArea: "Old Town",
    image: null,
  };

  const updated = applyProfileUpdate(initialUser, {
    name: "Alex Updated",
    serviceArea: "Metro Silicon Valley",
    image: "https://i.ibb.co/avatar.jpg",
  });

  assert.equal(updated.name, "Alex Updated");
  assert.equal(updated.serviceArea, "Metro Silicon Valley");
  assert.equal(updated.area, "Metro Silicon Valley", "area and serviceArea must remain in tandem");
  assert.equal(updated.image, "https://i.ibb.co/avatar.jpg");
  assert.equal(updated.email, "customer@fixmate.dev", "Email must remain unescalated");
  assert.equal(updated.role, "customer", "Role must remain protected");
});
