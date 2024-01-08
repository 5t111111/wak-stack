import { PageTitle } from "./PageTitle";

type Props = {
  title: string;
  thumbnailUrl: string;
  description?: string;
  author: {
    id: number;
    name: string;
    thumbnailUrl: string;
  };
};

export const SeriesHeading: React.FC<Props> = ({
  title,
  thumbnailUrl,
  description,
  author,
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
            <a className="hover:underline" href={`/author/${author.id}`}>
              {author.name}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
