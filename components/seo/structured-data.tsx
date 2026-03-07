type JsonLdPayload = Record<string, unknown> | Array<Record<string, unknown>>;

type StructuredDataProps = {
  data: JsonLdPayload;
  id: string;
};

function serialize(data: JsonLdPayload): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function StructuredData({ data, id }: StructuredDataProps) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
      id={id}
      type="application/ld+json"
    />
  );
}
