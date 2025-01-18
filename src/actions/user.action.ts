"use server";

import { auth, currentUser, User } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user: User | null = await currentUser();

    if (!user || !userId) return;

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (existingUser) return existingUser;

    return await prisma.user.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses[0].emailAddress,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        image: user.imageUrl,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
      },
    });
  } catch (e) {
    console.error("Error in syncUser: ", e);
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    return prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });
  } catch (e) {
    console.error("Error in getUserByClerkId: ", e);
  }
}

export async function getDbUserId() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return;

    const dbUser = await getUserByClerkId(clerkId);

    if (!dbUser) throw new Error("User not found");

    return dbUser.id;
  } catch (e) {
    console.error("Error in getDbUserId: ", e);
  }
}

export async function getRandomUsers() {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];

    return await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followers: {
                some: { followerId: userId },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
    });
  } catch (e) {
    console.error("Error in getRandomUsers: ", e);
  }
}

export async function toggleFollow(userId?: string) {
  try {
    const initiatorId = await getDbUserId();

    if (!initiatorId || !userId) return;

    if (initiatorId === userId)
      throw new Error("You can not follow your self.");

    const existFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: initiatorId,
          followingId: userId,
        },
      },
    });
    if (existFollow) {
      // Unfollow
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: initiatorId,
            followingId: userId,
          },
        },
      });
    } else {
      // Follow
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: initiatorId,
            followingId: userId,
          },
        }),
        prisma.notification.create({
          data: {
            userId: userId, // User being followed
            creatorId: initiatorId, // User following
            type: "FOLLOW",
          },
        }),
      ]);

      revalidatePath("/");

      return { success: true };
    }
  } catch (e) {
    console.error("Error in toggleFollow: ", e);
    return { success: false, error: "Error toggling follow" };
  }
}
