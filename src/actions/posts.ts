"use server";

import { prismaClient } from "@/lib/prisma";

export async function createPost({
  userId,
  content,
}: {
  userId: string;
  content: string;
}) {
  try {
    await prismaClient.post.create({
      data: {
        userId,
        content,
      },
    });
    return true;
  } catch (err) {
    return false;
  }
}

export async function deletePost(postId: string) {
  try {
    await prismaClient.post.delete({
      where: {
        id: postId,
      },
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
