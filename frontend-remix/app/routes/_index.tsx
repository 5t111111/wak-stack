import { MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Carousel } from "~/components/Carousel";
import { PostCard } from "~/components/PostCard";
import { PostRepository } from "~/server/adapter/database/post.repository.server";
import { GetNewPostListUseCase } from "~/server/usecases/index/get-new-post-list.usecase.server";
import { isProd } from "~/server/utils/environment.server";

export const loader = async () => {
  const useCase = new GetNewPostListUseCase(new PostRepository());
  const posts = await useCase.execute();
  const headers = isProd()
    ? {
        "Cache-Control":
          "public, max-age=0, s-maxage=300, stale-while-revalidate=300",
        "X-Cache-Control-Set-In": "_index",
      }
    : [];

  return json({ posts }, { headers });
};

export const meta: MetaFunction = () => {
  return [{ title: "WACK Stack Remix Showcase" }];
};

export default function Index() {
  const { posts: jsonifiedPosts } = useLoaderData<typeof loader>();

  const posts = jsonifiedPosts.map((jsonifiedPost) => ({
    ...jsonifiedPost,
    publishedAt: new Date(jsonifiedPost.publishedAt),
  }));

  return (
    <main>
      <div className="px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-5xl font-bold tracking-tight text-gray-900">
            WACK Stack Showcase
          </h2>
          <h2 className="mt-6 text-8xl font-bold tracking-tight text-gray-900">
            Remix
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Built with <b>W</b>ordPress,{" "}
            <s>
              <b>A</b>stro
            </s>
            , <b>C</b>DN, <b>K</b>
            ysely and <b>Remix</b>
          </p>
        </div>
      </div>
      <Carousel posts={posts.slice(0, 3)} />
      <section>
        <h2 className="mt-24 text-center text-4xl font-bold tracking-tight text-gray-900">
          New Posts
        </h2>
        <div className="px-4">
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {posts.slice(3, 10).map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                publishedAt={post.publishedAt}
                thumbnailUrl={post.thumbnailUrl}
              />
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
