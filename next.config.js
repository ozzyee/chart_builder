const withCSS = require("@zeit/next-css");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  }
}

module.exports = nextConfig
