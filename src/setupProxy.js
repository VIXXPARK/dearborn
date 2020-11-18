const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function (app) {
//     app.use(
//         '/api',
//         createProxyMiddleware({
//             target: 'https://dearborn.herokuapp.com',
//             changeOrigin: true,
//         })
//     );
// };

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8000',
            changeOrigin: true,
        })
    );
};