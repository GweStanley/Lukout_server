// utils/push.js
import webPush from "web-push";
import "dotenv/config"; // ensures .env is loaded before accessing process.env

const initWebPush = () => {
  console.log("VAPID CHECK:", { 
    public: !!process.env.VAPID_PUBLIC_KEY,
    private: !!process.env.VAPID_PRIVATE_KEY,
    email: process.env.VAPID_EMAIL,
  });

  const { VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
  if (!VAPID_EMAIL || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    throw new Error("❌ VAPID keys are missing. Check your .env file.");
  }

  webPush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  return webPush;
};

export default initWebPush;
