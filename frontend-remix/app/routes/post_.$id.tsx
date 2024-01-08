import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Breadcrumbs } from "~/components/Breadcrumb";
import { PostHeading } from "~/components/PostHeading";
import { PostRepository } from "~/server/adapter/database/post.repository.server";
import { NotFoundError } from "~/server/errors/not-found.error.server";
import {
  GetPostDetailUseCase,
  PostForPostDetail,
} from "~/server/usecases/post/[id]/get-post-detail.usecase.server";
import { isProd } from "~/server/utils/environment.server";
import { isNumber } from "~/server/utils/is-number.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) {
    throw new Error("id is not specified");
  }

  if (!isNumber(params.id)) {
    console.error(`${params.id} is not a number`);
    throw new Error("id is not a number");
  }

  const id = parseInt(params.id, 10);

  const useCase = new GetPostDetailUseCase(new PostRepository());

  let post: PostForPostDetail;

  try {
    post = await useCase.execute(id);
  } catch (e) {
    console.error(e);

    if (e instanceof NotFoundError) {
      throw new Error("Post is not found");
    }

    throw new Error("Something went wrong");
  }

  const headers = isProd()
    ? {
        "Cache-Control":
          "public, max-age=0, s-maxage=300, stale-while-revalidate=300",
        "X-Cache-Control-Set-In": "post_.$id",
      }
    : [];

  return json({ post }, { headers });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [];
  }

  const { post } = data;

  return [
    {
      title: `${post.title} | WACK Stack Remix Showcase`,
    },
  ];
};

export default function PostDetail() {
  const { post: jsonifiedPost } = useLoaderData<typeof loader>();

  const post = {
    ...jsonifiedPost,
    publishedAt: new Date(jsonifiedPost.publishedAt),
  };

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: post.category.name,
            href: `/category/${post.category.slug}`,
          },
          {
            label: post.title,
            href: `/post/${post.id}`,
          },
        ]}
      />
      <main>
        <PostHeading
          title={post.title}
          thumbnailUrl={post.thumbnailUrl}
          publishedAt={post.publishedAt}
          description={post.description}
          category={{ name: post.category.name, slug: post.category.slug }}
          author={{
            id: post.author.id,
            name: post.author.name,
            thumbnailUrl: post.author.thumbnailUrl,
          }}
          series={
            post.series && {
              id: post.series.id,
              title: post.series.title,
            }
          }
        />
        <hr className="my-8 h-px border-0 bg-gray-200" />
        {post.content && (
          <article
            className="prose mt-6 max-w-none px-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
      </main>
    </>
  );
}
