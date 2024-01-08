import React, { useState } from "react";

type Props = {
  currentPathname: string;
};

export const Navbar: React.FC<Props> = ({ currentPathname }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathCategories = [
    {
      path: "/post",
      label: "新着記事",
    },
    {
      path: "/category/fashion",
      label: "ファッション",
    },
    {
      path: "/category/technology",
      label: "テクノロジー",
    },
    {
      path: "/category/culture",
      label: "カルチャー",
    },
    {
      path: "/category/sports",
      label: "スポーツ",
    },
    {
      path: "/series",
      label: "連載",
    },
    {
      path: "/author",
      label: "著者",
    },
  ];
  const currentPathCategory = currentPathname.startsWith("/category/")
    ? currentPathname
    : `/${currentPathname.split("/")[1]}`;

  const handleMenuButtonClick = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  return (
    <nav className="w-screen bg-white shadow">
      <div className="mx-auto max-w-7xl pl-2 pr-4">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center pr-8">
              <a href="/">
                <img className="h-8" width="100px" src="/logo.svg" alt="Logo" />
              </a>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {pathCategories.map((pathCategory) => (
                <a
                  key={pathCategory.path}
                  href={pathCategory.path}
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                    currentPathCategory === pathCategory.path
                      ? "border-gray-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {pathCategory.label}
                </a>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={handleMenuButtonClick}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {pathCategories.map((pathCategory) => (
              <a
                key={pathCategory.path}
                href={pathCategory.path}
                className={`block border-l-4 ${
                  currentPathCategory === pathCategory.path
                    ? "border-gray-500 bg-gray-50 py-2 pl-3 pr-4 text-base font-medium text-gray-700"
                    : "block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                {pathCategory.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
