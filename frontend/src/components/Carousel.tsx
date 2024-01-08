import { CalendarIcon } from "@heroicons/react/20/solid";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { formatDate } from "../utils/date-util";

type Props = {
  posts: {
    id: number;
    title: string;
    publishedAt: Date;
    thumbnailUrl: string;
  }[];
};

export const Carousel: React.FC<Props> = ({ posts }: Props) => {
  const [emblaRef] = useEmblaCarousel(
    {
      align: "center",
      containScroll: false,
      loop: true,
    },
    [Autoplay()],
  );

  return (
    <section className="carousel">
      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {posts.map((post) => {
              return (
                <div key={post.id} className="embla__slide">
                  <a href={`/post/${post.id}`}>
                    <img
                      className="embla__slide__img"
                      src={post.thumbnailUrl}
                      alt={`Thumbnail for ${post.title}`}
                    />
                    <div className="mt-8">
                      <div className="text-2xl font-bold">{post.title}</div>
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
