import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol:
          (process.env.NEXT_PUBLIC_ASSETS_PROTOCOL as "http" | "https") ||
          "http",
        hostname: process.env.NEXT_PUBLIC_ASSETS_HOST || "172.16.1.23",
        port: process.env.NEXT_PUBLIC_ASSETS_PORT || "9006",
        pathname: "/public/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "api.healthapp.pro",
      },
      {
        protocol: "https",
        hostname: "api.healthapp.pro",
      },
    ],
  },
  webpack(config: any) {
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },

      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              typescript: true,
              icon: true,
              dimensions: false,
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    name: "preset-default",
                    params: {
                      overrides: {
                        removeViewBox: false,
                      },
                    },
                  },
                ],
              },
              replaceAttrValues: {
                "#000": "currentColor",
                "#000000": "currentColor",
                "#fff": "currentColor",
                "#ffffff": "currentColor",
                "#ffa400": "currentColor",
                "#2ba19b": "currentColor",
                "#1E7974": "currentColor",
                "#8C9190": "currentColor",
                "#143937": "currentColor",
                "#2BA19B": "currentColor",
                "#686C6C": "currentColor",
                "#C9961A": "currentColor",
                "#FFA400": "currentColor",
                "#2BAEA7": "currentColor",
                "#D42024": "currentColor",
                "#B1B7B6": "currentColor",
              },
            },
          },
        ],
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              typescript: true,
              icon: true,
              dimensions: false,
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    name: "preset-default",
                    params: {
                      overrides: {
                        removeViewBox: false,
                      },
                    },
                  },
                ],
              },
              replaceAttrValues: {
                "#000": "currentColor",
                "#000000": "currentColor",
                "#fff": "currentColor",
                "#ffffff": "currentColor",
                "#ffa400": "currentColor",
                "#2ba19b": "currentColor",
                "#1E7974": "currentColor",
                "#8C9190": "currentColor",
                "#143937": "currentColor",
                "#2BA19B": "currentColor",
                "#686C6C": "currentColor",
                "#C9961A": "currentColor",
                "#FFA400": "currentColor",
                "#2BAEA7": "currentColor",
                "#D42024": "currentColor",
              },
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
