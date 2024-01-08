import { Link } from "@remix-run/react";

import {
  CalendarIcon,
  FolderIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { formatDate } from "~/utils/date-util";

import { PageTitle } from "./PageTitle";

type Props = {
  title: string;
  thumbnailUrl: string;
  publishedAt: Date;
  description?: string;
  category: {
    name: string;
    slug: string;
  };
  author: {
    id: number;
    name: string;
    thumbnailUrl: string;
  };
  series?: {
    id: number;
    title: string;
  };
};

export const PostHeading: React.FC<Props> = ({
  title,
  thumbnailUrl,
  publishedAt,
  description,
  category,
  author,
  series,
}: Props) => {
  return (
    <div>
      <div className="mt-8 h-[400px] overflow-hidden">
        <img
          src={thumbnailUrl}
          className="h-full w-full object-cover object-center"
          height="400px"
          alt="Thumbnail"
        />
      </div>
      <div className="px-4">
        <div className="mt-8">
          {series && (
            <div className="mb-4 flex items-center text-sm text-gray-500 hover:underline">
              <FolderIcon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              <Link to={`/series/${series.id}`}>連載: {series.title}</Link>
            </div>
          )}
          <PageTitle title={title} />
        </div>
        {description && (
          <div className="text-md mt-3 font-bold">{description}</div>
        )}
        <div className="flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <div className="mr-1.5 h-5 w-5 flex-shrink-0" aria-hidden="true">
              <img
                src={author.thumbnailUrl}
                className="h-5 w-5 rounded-full"
                alt="Author thumbnail"
              />
            </div>
            <Link className="hover:underline" to={`/author/${author.id}`}>
              {author.name}
            </Link>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Squares2X2Icon
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
            <Link to={`/category/${category.slug}`} className="hover:underline">
              {category.name}
            </Link>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <CalendarIcon
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
            {formatDate(publishedAt)}
          </div>
        </div>
      </div>
    </div>
  );
};
