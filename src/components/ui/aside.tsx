"use client";

import { signIn, useSession, signOut } from "next-auth/react";
import { GithubIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Separator } from "./separator";

export function Aside() {
  const { data: session, status } = useSession();

  async function handleLoginWithGithub() {
    await signIn("github", {
      redirect: false,
    });
  }

  async function handleGithubLogout() {
    await signOut();
  }

  return (
    <aside className="max-w-xs w-full h-64 rounded border p-4 flex items-center justify-center flex-col max-md:max-w-full">
      {status === "unauthenticated" && (
        <div className="flex flex-col items-center gap-2">
          <LogInIcon size={30} />
          <h4 className="font-semibold text-lg">Acessar</h4>
          <span className="text-xs text-muted-foreground">
            Faça login com o seu Github
          </span>
          <Button
            className="gap-1 mt-4"
            variant="outline"
            onClick={handleLoginWithGithub}
          >
            <GithubIcon size={18} />
            Login com Github
          </Button>
        </div>
      )}
      {status === "loading" && (
        <span className="font-semibold text-sm">Carregando...</span>
      )}
      {status === "authenticated" && (
        <>
          <div className="flex items-center flex-col gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>{session.user?.name![0]}</AvatarFallback>
              {session.user?.image && (
                <AvatarImage
                  src={session?.user?.image}
                  alt="Github Profile Avatar"
                />
              )}
            </Avatar>
            <div className="text-center">
              <span className="text-muted-foreground text-xs">
                Olá. Bem-vindo(a)!
              </span>
              <h4 className="font-bold text-lg">{session.user?.name}</h4>
            </div>
          </div>

          <Separator className="my-6" />

          <Button
            className="w-full gap-1"
            variant="destructive"
            onClick={handleGithubLogout}
          >
            <LogOutIcon size={18} />
            Sair
          </Button>
        </>
      )}
    </aside>
  );
}
