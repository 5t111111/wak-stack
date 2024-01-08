import React from "react";

import { ChevronRightIcon } from "@heroicons/react/20/solid";

type Breadcrumb = {
  label: string;
  href: string;
};

type Props = {
  breadcrumbs: Breadcrumb[];
};

export const Breadcrumbs: React.FC<Props> = ({ breadcrumbs }) => {
  return (
    <div className="mt-8 px-4">
      <nav className="hidden sm:flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-4">
          <li>
            <div className="flex">
              <a
                href="/"
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                トップ
              </a>
            </div>
          </li>
          {breadcrumbs.map((breadcrumb) => (
            <li key={breadcrumb.href}>
              <div className="flex items-center">
                <ChevronRightIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <a
                  href={breadcrumb.href}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {breadcrumb.label}
                </a>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};
