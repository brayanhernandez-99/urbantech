export const WA_NUMBER = '573242923238';

export function whatsappLink(msg) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}
