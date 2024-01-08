import { Link } from "@remix-run/react";

type Props = {
  prevLink?: string;
  nextLink?: string;
};

export const Pagination: React.FC<Props> = ({ prevLink, nextLink }: Props) => {
  return (
    <nav className="mt-12 flex items-center justify-between px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        {prevLink ? (
          <Link
            to={prevLink}
            className="inline-flex items-center border-b-2 border-transparent pb-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            <svg
              className="mr-3 h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z"
                clipRule="evenodd"
              />
            </svg>
            Previous
          </Link>
        ) : (
          <span className="inline-flex items-center pb-4 pr-1 text-sm font-medium text-gray-300">
            <svg
              className="mr-3 h-5 w-5 text-gray-300"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z"
                clipRule="evenodd"
              />
            </svg>
            Previous
          </span>
        )}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        {nextLink ? (
          <Link
            to={nextLink}
            className="inline-flex items-center border-b-2 border-transparent pb-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Next
            <svg
              className="ml-3 h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        ) : (
          <span className="inline-flex items-center pb-4 pl-1 text-sm font-medium text-gray-300">
            Next
            <svg
              className="ml-3 h-5 w-5 text-gray-300"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </div>
    </nav>
  );
};
