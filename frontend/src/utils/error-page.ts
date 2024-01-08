export const renderErrorPage = (message: string, status: number) => {
  const pageTitle = `${status} | WACK Stack`;

  const body = `
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content="WACK Stack Showcase" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.png" />
    <title>${pageTitle}</title>
  </head>
  <h1>${status}</h1><p>${message}</p>
  <a href='/'>トップへ戻る</a>
`;
  const headers = { "Content-type": "text/html" };
  return new Response(body, { status, headers });
};
