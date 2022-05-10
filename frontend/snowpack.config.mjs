import proxy from 'http2-proxy';
/** @type {import("snowpack").SnowpackUserConfig } */

export default {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: ['@snowpack/plugin-react-refresh', '@snowpack/plugin-dotenv'],
  routes: [
    /* Enable an SPA Fallback in development: */
    // { match: 'routes', src: '.*', dest: '/index.html' },
    {
      src: '/api/.*',
      dest: (req, res) => {
        return proxy.web(req, res, { hostname: 'localhost', port: 5000 });
      },
    },
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
