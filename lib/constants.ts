export const WHATSAPP_NUMBER = "2349027458696";

export const WHATSAPP_LINK = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const DEFAULT_INQUIRY_TEXT = "Hello AuraByDassy! I have an inquiry.";
