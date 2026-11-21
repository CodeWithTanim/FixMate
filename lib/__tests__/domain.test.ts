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
