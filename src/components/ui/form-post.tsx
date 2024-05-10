"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { createPost } from "@/actions/posts";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { toast } from "./use-toast";

interface FormTweetProps {
  session: Session | null;
  userId: string;
}

export function FormPost({ session, userId }: FormTweetProps) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  async function handleCreatePost() {
    setIsLoading(true);
    const response = await createPost({ userId, content: input });

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
      description: "Post criado com sucesso!",
    });
    router.refresh();
    setInput("");
    setIsLoading(false);
  }

  return (
    <div className="grid w-full gap-2">
      <Textarea
        className="resize-none"
        placeholder="Escreva o que está pensando..."
        onChange={(e) => setInput(e.target.value)}
        value={input}
        disabled={!session}
        maxLength={150}
      />
      <span className="text-right text-xs">{input.length}/150</span>
      <Button
        className="w-fit"
        disabled={!session || !input || isLoading == true}
        onClick={handleCreatePost}
      >
        {isLoading ? (
          <span className="size-4 rounded-full border border-secondary border-t-zinc-400 animate-spin" />
        ) : (
          "Postar"
        )}
      </Button>
    </div>
  );
}
