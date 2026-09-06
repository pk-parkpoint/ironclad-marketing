import { handleBookingNotification } from "@/lib/booking-notification-handler";

export async function POST(request: Request) {
  return handleBookingNotification(request, "abandoned");
}
