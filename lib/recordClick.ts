export function recordClick({
  productId,
  productName,
  sku,
  source,
}: {
  productId?: string
  productName?: string
  sku?: string
  source: string
}) {
  fetch("/api/record-click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: productId || null,
      product_name: productName || "",
      sku: sku || "",
      source,
    }),
  }).catch(() => {});
}
