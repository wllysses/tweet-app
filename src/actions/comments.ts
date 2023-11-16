"use server";

import { prismaClient } from "@/lib/prisma";

export async function createComment({
  userId,
  postId,
  content,
}: {
  userId: string;
  postId: string;
  content: string;
}) {
  try {
    await prismaClient.comment.create({
      data: {
        userId,
        postId,
        content,
      },
    });
    return true;
  } catch (err) {
    return false;
  }
}

export async function deleteComment(commentId: string) {
  try {
    await prismaClient.comment.delete({
      where: {
        id: commentId,
      },
    });
    return true;
  } catch (err) {
    return false;
  }
}
