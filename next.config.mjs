import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: false
  },
  typescript: {
    ignoreBuildErrors: false
  }
}

export default withPayload(nextConfig)