"use server";

import { getDbUserId } from "@/actions/user.action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, imageUrl: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    const post = await prisma.post.create({
      data: {
        authorId: userId,
        content: content,
        image: imageUrl,
      },
    });

    revalidatePath("/");

    return { success: true, post };
  } catch (e) {
    console.error("Failed to create Post:", e);
    return { success: false, error: "Failed to create Post" };
  }
}

export async function getPosts() {
  try {
    return await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
  } catch (e) {
    console.error("Failed to get posts:", e);
    return [];
  }
}

export async function toggleLike(postId: string) {
  const userId = await getDbUserId();
  if (!userId) return;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found");

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      // Like
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  userId: post.authorId,
                  creatorId: userId,
                  type: "LIKE",
                },
              }),
            ]
          : []),
      ]);

      revalidatePath("/");

      return { success: true };
    }
  } catch (e) {
    console.error("Failed to toggleLike:", e);
    return { success: true };
  }
}

export async function createComment(postId: string, content: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;
    if (!content) throw new Error("Content is required.");

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found");

    const [comment] = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          content: content,
          authorId: userId,
          postId,
        },
      });

      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            userId: post.authorId,
            creatorId: userId,
            postId,
            commentId: newComment.id,
            type: "COMMENT",
          },
        });
      }

      return [newComment];
    });

    revalidatePath("/");

    return { success: true, comment };
  } catch (e) {
    console.error("Failed to create Comment:", e);
    return { success: false, error: "Failed to create Comment" };
  }
}

export async function deletePost(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId)
      throw new Error("Unauthorized - no delete permission");

    await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath("/");

    return { success: true };
  } catch (e) {
    console.error("Failed to delete Post:", e);
    return { success: false, error: "Failed to delete Post" };
  }
}
