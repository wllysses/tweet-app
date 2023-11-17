"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { Trash2Icon } from "lucide-react";
import { createComment } from "@/actions/comments";
import { deletePost } from "@/actions/posts";
import { User } from "@prisma/client";
import { Comment } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Separator } from "./separator";
import { Textarea } from "./textarea";
import { CommentsModal } from "./comments-modal";

interface PostProps {
  content: string;
  userAvatar: string;
  userName: string;
  comments: Comment[];
  createdAt: Date;
  session: Session | null;
  user: User;
  postId: string;
}

export function Post({
  content,
  userAvatar,
  userName,
  comments,
  createdAt,
  session,
  user,
  postId,
}: PostProps) {
  const router = useRouter();
  const [comment, setComment] = useState("");

  async function handleCreateComment() {
    const result = await createComment({
      userId: user.id,
      postId,
      content: comment,
    });

    if (!result) {
      alert("Algo deu errado...");
      return;
    }

    router.refresh();
    setComment("");
  }

  async function handleDeletePost(postId: string) {
    const result = await deletePost(postId);

    if (!result) {
      alert("Algo deu errado...");
      return;
    }

    router.refresh();
    setComment("");
  }

  return (
    <Card className="p-4">
      <CardHeader className="flex-row items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{userName![0]}</AvatarFallback>
            {userAvatar && (
              <AvatarImage src={userAvatar} alt="Profile Avatar" />
            )}
          </Avatar>
          <div>
            <CardTitle className="text-base">{userName}</CardTitle>
            <CardDescription className="text-xs">
              postado em {createdAt.toLocaleDateString("pt-BR")}
            </CardDescription>
          </div>
        </div>
        {session && session.user?.name === userName && (
          <Trash2Icon
            className="hover:text-red-500 cursor-pointer"
            size={18}
            onClick={() => handleDeletePost(postId)}
          />
        )}
      </CardHeader>
      <CardContent className="mt-2 text-sm p-2">{content}</CardContent>
      <Separator className="my-4" />

      <div className="">
        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="font-semibold text-sm">
            Seu comentário
          </label>
          <Textarea
            placeholder="Digite seu comentário"
            id="message"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={!session}
          />
          <Button
            className="w-fit"
            disabled={!session || !comment}
            onClick={handleCreateComment}
          >
            Comentar
          </Button>
          <span className="text-muted-foreground text-sm mt-2">
            <CommentsModal comments={comments} session={session} />
          </span>
        </div>
      </div>
    </Card>
  );
}
