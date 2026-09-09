import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  getDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";

export type NotificationTimestamp =
  | Date
  | string
  | number
  | { toDate?: () => Date; toMillis?: () => number }
  | null;

export type NotificationType =
  | "budget_alert"
  | "trip_created"
  | "accommodation_created"
  | "system";

export interface AppNotification {
  id?: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt?: NotificationTimestamp;
}

/**
 * Creates a notification in Firestore for a specific user,
 * respecting user notification settings (e.g. budgetWarnings).
 */
export async function createNotification(
  uid: string,
  notification: {
    title: string;
    message: string;
    type: NotificationType;
  }
) {
  if (!uid) return;

  try {
    // If it's a budget alert, check user preference
    if (notification.type === "budget_alert") {
      const userDocRef = doc(db, "users", uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.budgetWarnings === false) {
          // User turned off budget warnings
          return;
        }
      }
    }

    const notifColRef = collection(db, "users", uid, "notifications");
    await addDoc(notifColRef, {
      title: notification.title,
      message: notification.message,
      type: notification.type,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }
}

/**
 * Marks a single notification as read.
 */
export async function markNotificationAsRead(uid: string, notifId: string) {
  if (!uid || !notifId) return;
  try {
    const notifDocRef = doc(db, "users", uid, "notifications", notifId);
    await updateDoc(notifDocRef, { read: true });
  } catch (err) {
    console.error("Failed to mark notification as read:", err);
  }
}

/**
 * Marks all notifications as read for a user.
 */
export async function markAllNotificationsAsRead(uid: string) {
  if (!uid) return;
  try {
    const notifColRef = collection(db, "users", uid, "notifications");
    const snap = await getDocs(notifColRef);
    if (snap.empty) return;

    const batch = writeBatch(db);
    snap.docs.forEach((docSnap) => {
      if (!docSnap.data().read) {
        batch.update(docSnap.ref, { read: true });
      }
    });
    await batch.commit();
  } catch (err) {
    console.error("Failed to mark all notifications as read:", err);
  }
}

/**
 * Clears/Deletes all notifications for a user.
 */
export async function clearAllNotifications(uid: string) {
  if (!uid) return;
  try {
    const notifColRef = collection(db, "users", uid, "notifications");
    const snap = await getDocs(notifColRef);
    if (snap.empty) return;

    const batch = writeBatch(db);
    snap.docs.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
  } catch (err) {
    console.error("Failed to clear notifications:", err);
  }
}

/**
 * Checks if a new expense pushes spending past 80% or 100% threshold,
 * and creates an automated budget alert notification if so.
 */
export async function checkAndTriggerBudgetAlert(
  uid: string,
  newExpenseAmount: number,
  currentTotalSpent: number,
  totalBudget: number
) {
  if (!uid || totalBudget <= 0) return;
  const newSpent = currentTotalSpent + newExpenseAmount;
  const percentage = Math.round((newSpent / totalBudget) * 100);

  if (percentage >= 100) {
    await createNotification(uid, {
      title: "Budget Exceeded! ⚠️",
      message: `Total expenses ($${newSpent.toLocaleString()}) have reached ${percentage}% of your allocated budget ($${totalBudget.toLocaleString()}).`,
      type: "budget_alert",
    });
  } else if (percentage >= 80) {
    await createNotification(uid, {
      title: "Budget Limit Alert ⚠️",
      message: `You have reached ${percentage}% ($${newSpent.toLocaleString()}) of your allocated travel budget ($${totalBudget.toLocaleString()}).`,
      type: "budget_alert",
    });
  }
}
