import { User } from "@prisma/client";

export interface Comment {
  id: string;
  content: string;
  user?: User;
  created_at?: Date;
}
