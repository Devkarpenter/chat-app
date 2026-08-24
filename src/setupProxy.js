import { createProxyMiddleware } from 'http-proxy-middleware';

export default function setupProxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://cloud.appwrite.io',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // remove /api from the path
      },
    })
  );
};
