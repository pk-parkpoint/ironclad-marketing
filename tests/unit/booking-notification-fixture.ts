import type { BookingLeadPayload } from "../../lib/booking-lead";

export function notificationFixture(sessionId = "booking_test-attempt"): BookingLeadPayload {
  return {
    businessKey: "ironclad-plumbing", sessionId, siteSessionId: "site_test-session", status: "abandoned",
    booking: {
      address: "123 Example Street", bookingId: "NA", contactPreference: "Not Presented",
      customerName: "Test <Visitor>", email: "visitor@example.test", firstName: "Test",
      gateCode: "Not Presented", lastName: "<Visitor>", notes: "Not Presented",
      ownershipStatus: "Not Presented", petsOnPremise: "Not Presented", phone: "5125550100",
      photos: "Not Presented", preferredDate: "Not Presented", preferredWindow: "Not Presented",
      propertyType: "Not Presented", serviceCategory: "Leaks Blockages Sewer",
      serviceDetail: "Clear A Blockage", serviceDisplay: "Leaks Blockages Sewer > Clear A Blockage",
      state: "TX", street: "123 Example Street", city: "Austin", zip: "78701",
    },
    serverContext: { approximateZip: "NA", city: "NA", ipAddress: "NA", state: "NA" },
    tracking: {
      abandonmentScreen: "contact_info", bookingApiSubmitted: "No", bookingEntryPage: "/book?service=drain-clearing",
      browser: "Chrome", completionStatus: "abandoned", deviceType: "mobile", entryPage: "/plumbing/drain-clearing",
      fbclid: "NA", firstReferrerUrl: "NA", gbraid: "NA", gclid: "NA", lastPageBeforeExit: "/book",
      msclkid: "NA", operatingSystem: "Android", pagesVisited: ["/plumbing/drain-clearing", "/book"],
      returningVisitor: "New", screensVisited: ["select_issue", "contact_info"], source: "Google",
      timeInBookingMs: 3000, timeOnSiteBeforeBookingMs: 2000, totalSessionDurationMs: 5000,
      utmCampaign: "NA", utmContent: "NA", utmMedium: "NA", utmSource: "NA", utmTerm: "NA", wbraid: "NA",
    },
  };
}
