import { extractError } from "@/lib/utils";

import { redirect } from "next/navigation";
import { ZodSchema, infer as ZodInfer } from "zod";

import { getServerSession } from "./auth-client";
import { Session } from "better-auth";
type User = Session;
export const serverAction = <T extends ZodSchema<any> | undefined, R, U>(
  withAuth: boolean,
  actionOrSchema: T | ((user: U, data?: any) => Promise<R>),
  maybeAction?: (
    user: U,
    data: T extends ZodSchema<any> ? ZodInfer<T> : undefined,
  ) => Promise<R>,

  withSubscription?: boolean,
) => {
  const schema = (
    actionOrSchema instanceof ZodSchema ? actionOrSchema : undefined
  ) as T;
  const action = (
    typeof actionOrSchema === "function" ? actionOrSchema : maybeAction!
  ) as (
    user: U,
    data: T extends ZodSchema<any> ? ZodInfer<T> : undefined,
  ) => Promise<R>;

  return async (
    input?: unknown,
  ): Promise<{ error: string | null; res: R | null }> => {
    try {
      withAuth = withAuth == true || withSubscription == true;
      const session = await getServerSession();
      if (!session && withAuth) redirect("/");

      const parsedData = schema ? schema.parse(input) : input;

      // Pass the subscription object to the action function
      const result = await action(session as U, parsedData as any);

      return {
        error: null,
        res: result,
      };
    } catch (ex) {
      return {
        error: extractError(ex),
        res: null,
      };
    }
  };
};

export class ServerAction {
  static auth<T extends ZodSchema<any> | undefined, R>(
    actionOrSchema: T | ((user: User, data?: any) => Promise<R>),
    maybeAction?: (
      user: User,
      data: T extends ZodSchema<any> ? ZodInfer<T> : undefined,
    ) => Promise<R>,
  ) {
    return serverAction<T, R, User>(true, actionOrSchema, maybeAction);
  }

  // Update withSubscription to include the subscription parameter in action function
  static withSubscription<T extends ZodSchema<any> | undefined, R>(
    actionOrSchema: T | ((user: User, data: any | undefined) => Promise<R>),
    maybeAction?: (
      user: User,
      data: T extends ZodSchema<any> ? ZodInfer<T> : undefined,
    ) => Promise<R>,
  ) {
    return serverAction<T, R, User>(
      true,
      typeof actionOrSchema == "function"
        ? (user, data) => actionOrSchema(user, data)
        : actionOrSchema,
      maybeAction ? (u, d) => maybeAction(u, d) : undefined,
      undefined,
    );
  }

  static pass<T extends ZodSchema<any> | undefined, R>(
    actionOrSchema: T | ((user: User | null, data?: any) => Promise<R>),
    maybeAction?: (
      user: User | null,
      data: T extends ZodSchema<any> ? ZodInfer<T> : undefined,
    ) => Promise<R>,
  ) {
    return serverAction<T, R, User | null>(false, actionOrSchema, maybeAction);
  }
}
