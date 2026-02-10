import { NextRequest, NextResponse } from "next/server"

const DEFAULT_BASE_URL = process.env.API_BASE_URL
const DEFAULT_TOKEN = process.env.API_BEARER_TOKEN || ""

const getBaseUrl = () =>
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL

const filterHeaders = (headers: Headers) => {
  const result = new Headers()
  headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (["host", "connection", "content-length", "accept-encoding"].includes(lower)) return
    result.set(key, value)
  })
  return result
}

const proxyRequest = async (request: NextRequest, path: string[]) => {
  const baseUrl = (getBaseUrl() ?? "").replace(/\/$/, "")
  if (!baseUrl) {
    return new NextResponse(JSON.stringify({ error: "API base URL is not configured." }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }
  const url = `${baseUrl}/${path.join("/")}${request.nextUrl.search}`
  const headers = filterHeaders(request.headers)
  if (DEFAULT_TOKEN && !headers.get("authorization")) {
    headers.set("authorization", `Bearer ${DEFAULT_TOKEN}`)
  }

  const body =
    request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer()

  const response = await fetch(url, {
    method: request.method,
    headers,
    body,
  })

  const contentType = response.headers.get("content-type") || "application/json"
  const data = await response.text()

  return new NextResponse(data, {
    status: response.status,
    headers: {
      "content-type": contentType,
    },
  })
}

type RouteContext = { params: { path: string[] } }

const getPath = (context: RouteContext | any) => context?.params?.path ?? []

export async function GET(request: NextRequest, context: any) {
  return proxyRequest(request, getPath(context))
}

export async function POST(request: NextRequest, context: any) {
  return proxyRequest(request, getPath(context))
}

export async function PATCH(request: NextRequest, context: any) {
  return proxyRequest(request, getPath(context))
}

export async function PUT(request: NextRequest, context: any) {
  return proxyRequest(request, getPath(context))
}

export async function DELETE(request: NextRequest, context: any) {
  return proxyRequest(request, getPath(context))
}
