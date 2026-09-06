import { getBookingServiceIssuePrefill } from "@/lib/booking-service-prefill";

export type WizardFormData = {
  serviceCategory: string | null;
  serviceDetail: string | null;
  additionalNotes: string;
  selectedDate: string | null;
  timeOfDay: string | null;
  selectedWindowId: string | null;
  selectedOfferId: string | null;
  selectedStartTime: string | null;
  selectedEndTime: string | null;
  selectedWindowLabel: string | null;
  holdId: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  addressFormatted: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  latitude?: number;
  longitude?: number;
  propertyType: "residential" | "commercial" | null;
  ownershipStatus: "own" | "other" | null;
  gateCode: string;
  petsOnPremise: boolean;
  contactPreference: string[];
};

export type BookingConfirmation = {
  bookingId: string;
  appointmentId: string;
  confirmationNumber?: string;
  manageUrl?: string;
};

const INITIAL_FORM_DATA: WizardFormData = {
  serviceCategory: null, serviceDetail: null, additionalNotes: "",
  selectedDate: null, timeOfDay: "flexible",
  selectedWindowId: null, selectedOfferId: null,
  selectedStartTime: null, selectedEndTime: null,
  selectedWindowLabel: null, holdId: null,
  firstName: "", lastName: "", phone: "", email: "",
  addressFormatted: "", street: "", city: "", state: "", zip: "",
  propertyType: null, ownershipStatus: null,
  gateCode: "", petsOnPremise: false, contactPreference: [],
};

export type BookingWizardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialServiceSlug?: string;
};

export function getInitialWizardState(serviceSlug: string | null | undefined) {
  const serviceIssue = getBookingServiceIssuePrefill(serviceSlug);
  return {
    currentStep: serviceIssue ? 2 : 1,
    formData: serviceIssue ? { ...INITIAL_FORM_DATA, ...serviceIssue } : INITIAL_FORM_DATA,
    serviceIssue,
  };
}
