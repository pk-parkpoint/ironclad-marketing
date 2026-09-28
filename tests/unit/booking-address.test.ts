import assert from "node:assert/strict";
import { test } from "node:test";
import { parsePlace, manualStreetAddress, updateAddressLocality, notificationAddress, withoutCountry } from "../../lib/booking-address";
import { notifyConduitUpdate } from "../../lib/booking-conduit";
import { notificationFixture } from "./booking-notification-fixture";

const component = (type: string, long_name: string, short_name = long_name) => ({ types: [type], long_name, short_name });
test("Google component mapping preserves unit, postal suffix, locality priority and coordinates", () => {
  const parsed = parsePlace({
    address_components: [component("street_number", "123"), component("route", "Test Street"),
      component("locality", "Austin"), component("sublocality_level_1", "Downtown"),
      component("administrative_area_level_1", "Texas", "TX"), component("postal_code", "78701"),
      component("postal_code_suffix", "1234"), component("subpremise", "4B")],
    geometry: { location: { lat: () => 30, lng: () => -97 } },
  });
  assert.equal(parsed.addressFormatted, "123 Test Street #4B, Austin, TX 78701-1234");
  assert.equal(parsed.city, "Austin");
  assert.equal(parsed.zip, "78701-1234");
  assert.equal(parsed.latitude, 30);
  assert.equal(parsed.longitude, -97);
});
test("country removal is suffix-only and manual full addresses populate each field", () => {
  assert.equal(withoutCountry("123 USA Drive, Austin, TX 78701, USA"), "123 USA Drive, Austin, TX 78701");
  const parsed = manualStreetAddress("123 Test St, Apt 4B, Austin, TX 78701, United States");
  assert.deepEqual(parsed, { street: "123 Test St, Apt 4B", city: "Austin", state: "TX", zip: "78701", addressFormatted: "123 Test St, Apt 4B, Austin, TX 78701", latitude: undefined, longitude: undefined });
});
test("editing the street clears a prior Google locality and coordinates; manual locality keeps the display synchronized", () => {
  assert.equal(manualStreetAddress("456 ").street, "456 ");
  const changed = manualStreetAddress("456 Other Street");
  assert.equal(changed.city, "");
  assert.equal(changed.state, "");
  assert.equal(changed.zip, "");
  assert.equal(changed.latitude, undefined);
  const address = { street: "456 Other Street", city: "Round Rock", state: "TX", zip: "78664" };
  assert.deepEqual(updateAddressLocality(address, "zip", "78665"), { zip: "78665", addressFormatted: "456 Other Street, Round Rock, TX 78665", latitude: undefined, longitude: undefined });
});
test("notification fallback preserves complete addresses and sentinel/incomplete values", () => {
  const booking = notificationFixture().booking;
  assert.equal(notificationAddress(booking), "123 Example Street, Austin, TX 78701");
  assert.equal(notificationAddress({ ...booking, address: "123 Example Street, Apt 4B, Austin, TX 78701, USA" }), "123 Example Street, Apt 4B, Austin, TX 78701");
  assert.equal(notificationAddress({ ...booking, address: "Not Presented" }), "Not Presented");
  assert.equal(notificationAddress({ ...booking, city: "NA" }), "123 Example Street");
});
test("Conduit receives the full address and separate locality on completed and abandoned notifications", async (t) => {
  const oldUrl = process.env.BOOKING_WEBHOOK_URL;
  process.env.BOOKING_WEBHOOK_URL = "https://conduit.example.test/booking";
  t.after(() => { if (oldUrl === undefined) delete process.env.BOOKING_WEBHOOK_URL; else process.env.BOOKING_WEBHOOK_URL = oldUrl; });
  const bodies: { booking: Record<string, string> }[] = [];
  t.mock.method(globalThis, "fetch", async (_url: string, init: RequestInit) => {
    bodies.push(JSON.parse(String(init.body)));
    return new Response("{}", { status: 200 });
  });
  for (const status of ["completed", "abandoned"] as const) {
    assert.equal(await notifyConduitUpdate({ ...notificationFixture(), status }), "sent");
  }
  assert.equal(bodies.length, 2);
  for (const { booking } of bodies) {
    assert.equal(booking.address, "123 Example Street, Austin, TX 78701");
    assert.equal(booking.city, "Austin"); assert.equal(booking.state, "TX"); assert.equal(booking.zip, "78701");
  }
});
