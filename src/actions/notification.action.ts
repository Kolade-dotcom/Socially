"use server";

import { getDbUserId } from "@/actions/user.action";
import { prisma } from "@/lib/prisma";

export async function getNotifications() {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];

    return await prisma.notification.findMany({
      where: {
        userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            image: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (e) {
    console.error("Error fetching notifications: ", e);
    return [];
  }
}

export async function markNotificationsAsRead(notificationIds: string[]) {
  try {
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
      },
      data: {
        read: true,
      },
    });

    return { success: true };
  } catch (e) {
    console.error("Error in markNotificationsAsRead: ", e);
    return { success: false };
  }
}
