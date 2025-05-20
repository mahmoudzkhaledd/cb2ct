import { extractError } from "@/lib/utils";

import { redirect } from "next/navigation";
import { ZodSchema, infer as ZodInfer } from "zod";

import { getServerSession } from "./auth-client";
import { Session, User } from "better-auth";
type UserType = {
  session: Session;
  user: User;
};
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
    actionOrSchema: T | ((user: UserType, data?: any) => Promise<R>),
    maybeAction?: (
      user: UserType,
      data: T extends ZodSchema<any> ? ZodInfer<T> : undefined,
    ) => Promise<R>,
  ) {
    return serverAction<T, R, UserType>(true, actionOrSchema, maybeAction);
  }

  // Update withSubscription to include the subscription parameter in action function
  static withSubscription<T extends ZodSchema<any> | undefined, R>(
    actionOrSchema: T | ((user: UserType, data: any | undefined) => Promise<R>),
    maybeAction?: (
      user: UserType,
      data: T extends ZodSchema<any> ? ZodInfer<T> : undefined,
    ) => Promise<R>,
  ) {
    return serverAction<T, R, UserType>(
      true,
      typeof actionOrSchema == "function"
        ? (user, data) => actionOrSchema(user, data)
        : actionOrSchema,
      maybeAction ? (u, d) => maybeAction(u, d) : undefined,
      undefined,
    );
  }

  static pass<T extends ZodSchema<any> | undefined, R>(
    actionOrSchema: T | ((user: UserType | null, data?: any) => Promise<R>),
    maybeAction?: (
      user: UserType | null,
      data: T extends ZodSchema<any> ? ZodInfer<T> : undefined,
    ) => Promise<R>,
  ) {
    return serverAction<T, R, UserType | null>(
      false,
      actionOrSchema,
      maybeAction,
    );
  }
}
