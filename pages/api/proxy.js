import { createProxyMiddleware } from 'http-proxy-middleware';

export default function handler(req, res) {
  const proxy = createProxyMiddleware({
    target: 'http://45.76.80.83:3000',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/api/proxy': '', // remove "/api/proxy" from the request path
    },
  });
  proxy(req, res);
}
