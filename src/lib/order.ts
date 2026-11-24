import { product, formatPrice, whatsappNumber } from "../data/product.ts";

interface OrderDetails {
  quantity: number;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
}

export function buildOrderUrl(details: OrderDetails) {
  if (
    !Number.isInteger(details.quantity) ||
    details.quantity < 1 ||
    details.quantity > 20
  ) {
    throw new RangeError("Quantity must be between 1 and 20");
  }
  const message = [
    "السلام عليكم، بغيت نطلب من SkinLuxe:",
    "",
    `المنتج: ${product.name}`,
    `ثمن الوحدة: ${formatPrice(product.unitPrice)}`,
    `الكمية: ${details.quantity}`,
    `مجموع المنتجات: ${formatPrice(product.unitPrice * details.quantity)}`,
    "مصاريف التوصيل: تتأكد قبل تأكيد الطلب",
    "",
    `الاسم الكامل: ${details.fullName}`,
    `رقم الهاتف: ${details.phone}`,
    `المدينة: ${details.city}`,
    `عنوان التوصيل: ${details.address}`,
    ...(details.notes ? [`ملاحظات: ${details.notes}`] : []),
    "",
    "عافاكم أكدوا ليا توفر المنتج ومصاريف التوصيل.",
  ].join("\n");
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
