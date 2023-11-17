"use client";

import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { MessageCircleIcon, Trash2Icon } from "lucide-react";
import { Comment } from "@/types";
import { deleteComment } from "@/actions/comments";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { Button } from "./button";

interface CommentsModalProps {
  comments: Comment[];
  session: Session | null;
}

export function CommentsModal({ comments, session }: CommentsModalProps) {
  const router = useRouter();

  async function handleDeleteComment(commentId: string) {
    const result = await deleteComment(commentId);

    if (!result) {
      alert("Algo deu errado...");
      return;
    }

    router.refresh();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="gap-2 px-2">
          <MessageCircleIcon size={18} />
          {comments.length}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="border-b pb-1">
            Comentários
          </AlertDialogTitle>
          {!comments.length && <span>Nenhum comentário</span>}
          {comments &&
            comments.map((comment) => (
              <AlertDialogDescription
                key={comment.id}
                className="border p-4 rounded"
              >
                <div className="mb-3 w-full flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback>{comment.user?.name![0]}</AvatarFallback>
                      {comment.user?.image && (
                        <AvatarImage
                          src={comment.user?.image}
                          alt="Profile Avatar"
                        />
                      )}
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-base">
                        {comment.user?.name}
                      </h4>
                      <span className="text-xs">
                        publicado em{" "}
                        {comment.created_at?.toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                  {session && session.user?.name === comment.user?.name && (
                    <Trash2Icon
                      size={18}
                      className="cursor-pointer hover:text-red-500"
                      onClick={() => handleDeleteComment(comment.id)}
                    />
                  )}
                </div>
                {comment.content}
              </AlertDialogDescription>
            ))}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Fechar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
