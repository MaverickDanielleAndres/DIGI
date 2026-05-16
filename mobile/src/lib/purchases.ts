import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEYS = {
  apple: "appl_api_key_here",
  google: "goog_api_key_here"
};

export async function setupPurchases(userId?: string) {
  if (Platform.OS === 'ios') {
    Purchases.configure({ apiKey: API_KEYS.apple, appUserID: userId });
  } else if (Platform.OS === 'android') {
    Purchases.configure({ apiKey: API_KEYS.google, appUserID: userId });
  }
}

export async function getSubscriptionStatus() {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return {
      isPro: typeof customerInfo.entitlements.active['pro'] !== "undefined",
      customerInfo
    };
  } catch (e) {
    console.error("Failed to get subscription status", e);
    return { isPro: false, customerInfo: null };
  }
}

export async function purchasePro() {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
      const { customerInfo } = await Purchases.purchasePackage(offerings.current.availablePackages[0]);
      if (typeof customerInfo.entitlements.active['pro'] !== "undefined") {
        return true;
      }
    }
  } catch (e) {
    console.error("Purchase failed", e);
  }
  return false;
}
