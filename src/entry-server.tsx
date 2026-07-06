// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="zh-CN">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.svg" />
          <title>qrframe - 代码驱动的二维码设计器</title>
          <meta
            name="description"
            content="使用 Javascript 代码创建漂亮的二维码。"
          />
          {assets}
        </head>
        <body class="bg-back-base text-fore-base [--un-default-border-color:fg-subtle]">
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
