// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

// module.exports = {
//     mode: 'development', // or 'production'
//     entry: './src/index.tsx',
//     output: {
//         path: path.resolve(__dirname, 'dist'),
//         filename: 'bundle.js',
//     },
//     resolve: {
//         extensions: ['.ts', '.tsx', '.js', '.jsx'],
//     },
//     devServer: {
//       static: {
//         directory: path.join(__dirname, 'dist'),
//       },
//       compress: true,
//       port: 8080,
//       open: true,
//     },    
//     module: {
//       rules: [
//       {
//         test: /\.worker\.ts$/,
//         use: ['workerize-loader'],
//         exclude: path.resolve(__dirname, 'node_modules'),
//       },
//         {
//           test: /\.tsx?$/,
//           use: {
//             loader: 'ts-loader',
//             options: {
//               // ignoreErrors: true, // Remove or comment out this line
//               // Other ts-loader options...
//             },
//           },
//           exclude: /node_modules/,
//         },
//         {
//           test: /\.css$/,
//           use: ['style-loader', 'css-loader']
//         },
//         {
//             test: /\.svg$/,
//             use: ['file-loader']
//         },
//         {
//           loader: 'file-loader',
//           options: {
//             outputPath: 'images', // Output directory for images
//           },
//         },
//       ],
//     },
//     plugins: [
//       new HtmlWebpackPlugin({
//           template: './public/index.html', // Path to your HTML template file
//           filename: 'index.html', // Output HTML filename
//       }),
//   ],  
// };
