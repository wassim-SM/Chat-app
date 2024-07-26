import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { db } from "./firebase";
import { useuserStore } from "./userstore";
import { doc, getDoc } from "firebase/firestore";

export const useChatStore = create(
  devtools((set) => ({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,
    changeChat: async (chatId, user) => {
      const currentUser = useuserStore.getState().currentUser;

      if (!currentUser) {
        console.error("No current user found.");
        return;
      }

      try {
        // Check if the current user is blocked by the receiver
        if (user.blocked && user.blocked.includes(currentUser.id)) {
          return set({
            chatId: chatId,
            user: null,
            isCurrentUserBlocked: true,
            isReceiverBlocked: false,
          });
        }

        // Check if the receiver is blocked by the current user
        const currentUserDoc = await getDoc(doc(db, "users", currentUser.id));
        if (currentUserDoc.exists()) {
          const currentUserData = currentUserDoc.data();

          if (currentUserData.blocked && currentUserData.blocked.includes(user.id)) {
            return set({
              chatId: chatId,
              user: null,
              isCurrentUserBlocked: false,
              isReceiverBlocked: true,
            });
          }
        }

        // If neither user is blocked, update the chat state
        set({
          chatId: chatId,
          user: user,
          isCurrentUserBlocked: false,
          isReceiverBlocked: false,
        });
      } catch (error) {
        console.error("Error checking block status:", error);
      }
    },
  }))
);
