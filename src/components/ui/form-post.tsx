"use client";

import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { createPost } from "@/actions/posts";
import { useState } from "react";

interface FormTweetProps {
  session: Session | null;
  userId: string;
}

export function FormPost({ session, userId }: FormTweetProps) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  async function handleCreateTweet() {
    setIsLoading(true);
    const result = await createPost({ userId, content: input });

    if (!result) {
      alert("Algo deu errado...");
      return;
    }

    router.refresh();
    setInput("");
    setIsLoading(false);
  }

  return (
    <div className="grid w-full gap-2">
      <Textarea
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
        onClick={handleCreateTweet}
      >
        {isLoading ? (
          <span className="h-4 w-4 rounded-full border border-secondary border-t-zinc-400 animate-spin" />
        ) : (
          "Postar"
        )}
      </Button>
    </div>
  );
}
