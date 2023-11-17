import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/lib/nextAuth";
import { prismaClient } from "@/lib/prisma";
import { Aside } from "@/components/ui/aside";
import { Post } from "@/components/ui/post";
import { Separator } from "@/components/ui/separator";
import { FormPost } from "@/components/ui/form-post";
import { ModeToggle } from "@/components/ui/theme-toggle";

export default async function Home() {
  const session = await getServerSession(nextAuthOptions);

  const posts = await prismaClient.post.findMany({
    include: {
      user: true,
      comments: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  return (
    <>
      <header className="p-4 border-b">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="font-bold text-3xl">
            Dev<span className="text-primary">Tweet</span>
          </h1>
          <ModeToggle />
        </div>
      </header>

      <main className="my-8 container mx-auto flex gap-6 max-md:flex-col">
        <Aside />
        <div className="flex-1 flex flex-col gap-4">
          <FormPost session={session} userId={user?.id!} />

          <Separator className="my-4" />

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Feed</h3>
            <div className="flex flex-col gap-4">
              {!posts.length && <div>Nenhum post</div>}
              {posts &&
                posts.map((post) => (
                  <Post
                    key={post.id}
                    content={post.content}
                    userAvatar={post.user.image!}
                    userName={post.user.name!}
                    comments={post.comments!}
                    createdAt={post.created_at}
                    session={session}
                    user={user!}
                    postId={post.id}
                  />
                ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
