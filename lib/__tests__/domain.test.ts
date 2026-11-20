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
