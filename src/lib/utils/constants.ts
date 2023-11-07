import type { ToastSettings } from "@skeletonlabs/skeleton";

export const ogImageUrl =
  "/og-banner.jpg";
export const ogLogoImg =
  "/og-logo.png";
export const kindLinks = 30001;
export const kindNotes = 1;
export const kindArticles = 30023;
export const kindCSSReplaceableAsset = 35393;
export const kindCSSAsset = 5393;
export const toastTimeOut = 3500;
export const outNostrLinksUrl = "https://njump.me";
export const CORSproxyUrl = "https://corsproxy.io/?";
export const defaulTheme = "nostree-theme";

export const succesPublishToast: ToastSettings = {
  message: "Published successfully!",
  timeout: toastTimeOut,
  hoverable: true,
  background: "variant-filled-success",
};
export const errorPublishToast: ToastSettings = {
  message: "Error on publishing, look at console!",
  timeout: toastTimeOut,
  hoverable: true,
  background: "variant-filled-error",
};
export const succesDeletingToast: ToastSettings = {
  message: "Deleted successfully!",
  timeout: toastTimeOut,
  hoverable: true,
  background: "variant-filled-success",
};
export const defaultThemes = [
  { type: "nostree-theme", name: "Nostree", icon: "🦩" },
  { type: "skeleton", name: "Skeleton", icon: "💀" },
  { type: "crimson", name: "Crimson", icon: "⭕" },
  { type: "modern", name: "Modern", icon: "🤖" },
  { type: "rocket", name: "Rocket", icon: "🚀" },
  { type: "sahara", name: "Sahara", icon: "🏜️" },
  { type: "wintry", name: "Wintry", icon: "🌨️" },
  { type: "seafoam", name: "Seafoam", icon: "🧜‍♀️" },
  { type: "vintage", name: "Vintage", icon: "📺" },
  { type: "hamlindigo", name: "Hamlindigo", icon: "👔" },
  { type: "gold-nouveau", name: "Gold Nouveau", icon: "💫" },
  { type: "customTheme", name: "Custom", icon: "🎨" },
];
