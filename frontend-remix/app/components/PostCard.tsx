import { Link } from "@remix-run/react";

import { CalendarIcon } from "@heroicons/react/20/solid";
import { formatDate } from "~/utils/date-util";

type Props = {
  id: number;
  title: string;
  thumbnailUrl: string;
  publishedAt: Date;
};

export const PostCard: React.FC<Props> = ({
  id,
  title,
  thumbnailUrl,
  publishedAt,
}: Props) => {
  return (
    <li className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow">
      <Link to={`/post/${id}`}>
        <div className="flex flex-1 flex-col">
          <img
            className="mx-auto h-60 w-full flex-shrink-0 rounded-t-lg object-cover object-center"
            src={thumbnailUrl}
            alt={`Thumbnail for ${title}`}
          />
          <div className="mx-4 mt-6">
            <h3 className="text-sm font-bold text-gray-900">{title}</h3>
            <div className="mb-6 mt-4 flex items-center text-sm text-gray-500">
              <CalendarIcon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {formatDate(publishedAt)}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};
