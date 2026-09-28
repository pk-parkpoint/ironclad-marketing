export type GooglePlaceResult = {
  address_components?: { long_name: string; short_name: string; types: string[] }[];
  formatted_address?: string;
  geometry?: { location?: { lat: () => number; lng: () => number } };
};
type AddressFields = { street: string; city: string; state: string; zip: string };

export function withoutCountry(value: string): string {
  return value.trim().replace(/,\s*(?:USA|US|United States(?: of America)?)\s*$/i, "");
}

export function formatAddress({ street, city, state, zip }: AddressFields): string {
  return [street.trim(), city.trim(), [state.trim(), zip.trim()].filter(Boolean).join(" ")].filter(Boolean).join(", ");
}

export function parsePlace(place: GooglePlaceResult) {
  const components = place.address_components || [];
  const component = (type: string, short = false) => {
    const entry = components.find(value => value.types.includes(type));
    return (short ? entry?.short_name : entry?.long_name) || "";
  };
  const street = [component("street_number"), component("route")].filter(Boolean).join(" ");
  const unit = component("subpremise");
  const address = {
    street: [street, unit ? `#${unit}` : ""].filter(Boolean).join(" "),
    city: component("locality") || component("postal_town") || component("sublocality_level_1"),
    state: component("administrative_area_level_1", true),
    zip: [component("postal_code"), component("postal_code_suffix")].filter(Boolean).join("-"),
  };
  return {
    ...address,
    addressFormatted: address.street ? formatAddress(address) : withoutCountry(place.formatted_address || ""),
    latitude: place.geometry?.location?.lat(),
    longitude: place.geometry?.location?.lng(),
  };
}

// Free typing invalidates the coordinates and locality from any prior selection.
// Accept a pasted complete US address too, without requiring Google to be available.
export function manualStreetAddress(value: string) {
  const raw = value.replace(/,\s*(?:USA|US|United States(?: of America)?)\s*$/i, "");
  const match = raw.match(/^(.+),\s*([^,]+),\s*([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)$/);
  const address = match
    ? { street: match[1].trim(), city: match[2].trim(), state: match[3].toUpperCase(), zip: match[4] }
    : { street: raw, city: "", state: "", zip: "" };
  return { ...address, addressFormatted: formatAddress(address), latitude: undefined, longitude: undefined };
}

export function updateAddressLocality(form: AddressFields, field: "city" | "state" | "zip", value: string) {
  const address = { ...form, [field]: field === "state" ? value.toUpperCase() : value };
  return { [field]: address[field], addressFormatted: formatAddress(address), latitude: undefined, longitude: undefined };
}

// Older clients can send a street-only display string with complete structured
// fields. Preserve existing full/unit-bearing text; append only missing locality.
export function notificationAddress(booking: AddressFields & { address: string }): string {
  const raw = withoutCountry(booking.address);
  const real = (value: string) => Boolean(value && value !== "NA" && value !== "Not Presented");
  if ([booking.city, booking.state, booking.zip].every(real) &&
      (raw === booking.street || !raw.includes(",")) && real(raw)) {
    return formatAddress({ ...booking, street: raw });
  }
  return raw;
}
