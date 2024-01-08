import { Link } from "@remix-run/react";

type Props = {
  id: number;
  title: string;
  thumbnailUrl: string;
  postCount: number;
};

export const SeriesCard: React.FC<Props> = ({
  id,
  title,
  thumbnailUrl,
  postCount,
}: Props) => {
  return (
    <li className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow">
      <Link to={`/series/${id}`}>
        <div className="flex flex-1 flex-col">
          <img
            className="mx-auto h-60 w-full flex-shrink-0 rounded-t-lg object-cover object-center"
            src={thumbnailUrl}
            alt={`Thumbnail for ${title}`}
          />
          <div className="mx-4 mt-6">
            <h3 className="text-sm font-bold text-gray-900">{title}</h3>
            <div className="mb-6 mt-3 flex items-center text-sm text-gray-600">
              {postCount > 0 ? `全${postCount}回` : "まだ投稿がありません"}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};
