export const product = {
  name: "كريم إيفولف لتجديد البشرة",
  unitPrice: 250,
  currency: "درهم",
};

export const whatsappNumber = "212670457018";

export function formatPrice(amount: number) {
  return `${amount.toLocaleString("fr-MA")} ${product.currency}`;
}
