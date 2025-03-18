import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

// the Request is the default one. Nothing fancy from Next JS
export const POST = async (req: Request) => {
  try {
    // * Conditions for subreddit:
    // * 1: if user is not logged in, then we give an unauthorized error
    const session = await getAuthSession();

    if (!session) {
      return new Response(
        JSON.stringify({
          data: null,
          error: {
            title: "Unauthorized",
            message: "Please login to create a subreddit",
          },
          status: 401,
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // earlier it was req.body()
    // but now in Next 13 and above its req.json();
    const body = await req.json();
    // we validate to only allow the data that we want
    const { name } = SubredditValidator.parse(body);

    // * 2: if subreddit with same name already exists then throw error
    const subredditExists = await db.subreddit.findFirst({
      where: {
        name: name,
      },
    });

    if (subredditExists) {
      return new Response(
        JSON.stringify({
          data: null,
          error: {
            title: "Conflict",
            message: "Subreddit already exists",
          },
          status: 409,
        }),
        {
          status: 409,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // * create new subreddit if all checks are passed
    const subreddit = await db.subreddit.create({
      data: {
        name: name,
        creatorId: session.user.id,
      },
    });

    // when you create a subreddit, automatically subscribe to it
    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id,
      },
    });

    return new Response(
      JSON.stringify({
        data: {
          subreddit: {
            name: subreddit.name,
            id: subreddit.id,
          },
        },
        error: null,
        status: 200,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    // if error is thrown if the parsing failed
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          data: null,
          error: {
            title: error.name,
            message: error.message,
          },
          status: 422,
        }),
        {
          status: 422,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // for rest of the errors
    return new Response(
      JSON.stringify({
        data: null,
        error: "Could not create subreddit",
        status: 500,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
