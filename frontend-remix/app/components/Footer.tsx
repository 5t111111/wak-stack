import { Link } from "@remix-run/react";

export const Footer: React.FC = () => {
  const navigation = {
    main: [
      { name: "トップ", href: "/" },
      { name: "新着記事", href: "/post" },
      { name: "連載", href: "/series" },
      { name: "著者", href: "/author" },
    ],
    category: [
      { name: "ファッション", href: "/category/fashion" },
      { name: "テクノロジー", href: "/category/technology" },
      { name: "カルチャー", href: "/category/culture" },
      { name: "スポーツ", href: "/category/sports" },
    ],
  };

  return (
    <footer className="mt-24 bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12">
          {navigation.main.map((item) => (
            <div key={item.href} className="pb-6">
              <Link
                to={item.href}
                className="text-sm leading-6 hover:text-gray-300"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        <nav className="mt-8 columns-2 sm:flex sm:justify-center sm:space-x-12">
          {navigation.category.map((item) => (
            <div key={item.href} className="pb-6">
              <Link
                to={item.href}
                className="text-sm leading-6 hover:text-gray-300"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        <div className="mt-4 flex justify-center space-x-10">
          <a
            href="https://github.com/5t111111/wak-stack"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">GitHub</span>
            <img src="/github.svg" alt="GitHub" className="h-6 w-6" />
          </a>
          <a
            href="https://zenn.dev/5t111111/articles/wack-stack-introduction"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">Zenn</span>
            <img src="/zenn.svg" alt="Zenn" className="h-6 w-6" />
          </a>
          <a
            href="https://kodansha.tech/ja/blogs/wack-stack-introduction"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">KODANSHAtech</span>
            <img
              src="/kodanshatech.svg"
              alt="KODANSHAtech"
              className="h-6 w-6"
            />
          </a>
        </div>
        <div className="mt-10 text-center text-sm hover:text-gray-300">
          <Link to="https://wack.kodansha.tech/">Original Version</Link>
        </div>
        <p className="mt-10 text-center text-xs leading-5">
          &copy; 2024 WACK Stack
        </p>
      </div>
    </footer>
  );
};
