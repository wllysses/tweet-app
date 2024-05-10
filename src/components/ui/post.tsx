"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { Trash2Icon } from "lucide-react";
import { createComment } from "@/actions/comments";
import { deletePost } from "@/actions/posts";
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
import { CommentsModal } from "./comments-modal";
import { Separator } from "./separator";
import { Textarea } from "./textarea";
import { toast } from "./use-toast";

interface PostProps {
  content: string;
  userAvatar: string;
  userName: string;
  comments: Comment[];
  createdAt: Date;
  session: Session | null;
  userId: string;
  postId: string;
}

export function Post({
  content,
  userAvatar,
  userName,
  comments,
  createdAt,
  session,
  userId,
  postId,
}: PostProps) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  async function handleCreateComment() {
    setIsLoading(true);
    const response = await createComment({
      userId,
      postId,
      content: comment,
    });

    if (!response) {
      toast({
        title: "Erro",
        description: "Algo deu errado...",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Comentário criado com sucesso!",
    });
    router.refresh();
    setComment("");
    setIsLoading(false);
  }

  async function handleDeletePost(postId: string) {
    if (confirm("Deseja deletar o post?")) {
      const response = await deletePost(postId);

      if (!response) {
        toast({
          title: "Erro",
          description: "Algo deu errado... Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Post deletado com sucesso!",
      });
      router.refresh();
      setComment("");
      return;
    }
  }

  return (
    <Card className="p-4">
      <CardHeader className="flex-row items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{userName![0]}</AvatarFallback>
            {userAvatar && (
              <AvatarImage src={userAvatar} alt="Github Profile Avatar" />
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
            onClick={async () => await handleDeletePost(postId)}
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
            maxLength={150}
          />
          <Button
            className="w-fit"
            disabled={!session || !comment || isLoading === true}
            onClick={handleCreateComment}
          >
            {isLoading ? (
              <span className="h-4 w-4 rounded-full border border-secondary border-t-zinc-400 animate-spin" />
            ) : (
              "Comentar"
            )}
          </Button>
          <span className="text-muted-foreground text-sm mt-2">
            <CommentsModal comments={comments} session={session} />
          </span>
        </div>
      </div>
    </Card>
  );
}
