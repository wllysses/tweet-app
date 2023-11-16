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

  async function handleCreateTweet() {
    const result = await createPost({ userId, content: input });

    if (!result) {
      alert("Algo deu errado...");
      return;
    }

    router.refresh();
    setInput("");
  }

  return (
    <div className="grid w-full gap-2">
      <Textarea
        placeholder="Escreva o que está pensando..."
        onChange={(e) => setInput(e.target.value)}
        value={input}
        disabled={!session}
      />
      <Button
        className="w-fit"
        disabled={!session || !input}
        onClick={handleCreateTweet}
      >
        Postar
      </Button>
    </div>
  );
}
