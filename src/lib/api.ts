const DEFAULT_BASE_URL = "/api/proxy"

export const getApiBaseUrl = () => "http://192.168.0.114:3030/api"

export type ApiRequestOptions = {
  method?: string
  body?: unknown
  token?: string
}

export const apiRequest = async <T>(path: string, options: ApiRequestOptions = {}) => {
  const { method = "GET", body, token } = options
  const url = `${getApiBaseUrl()}${path}`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  const authToken = token ?? ""
  if (authToken) headers.Authorization = `Bearer ${authToken}`

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const text = await response.text()
    const parseJson = () => JSON.parse(text)
    try {
      const json = parseJson()
      const issues = json?.error?.details?.issues || json?.details?.issues
      const issueText = Array.isArray(issues)
        ? issues.map((issue: any) => issue?.message).filter(Boolean).join("; ")
        : ""
      const message =
        issueText ||
        json?.error?.message ||
        json?.message ||
        json?.error ||
        `Request failed: ${response.status}`
      throw new Error(message)
    } catch {
      if (text.trim().startsWith("{")) {
        try {
          const json = parseJson()
          const message = json?.error?.message || json?.message || `Request failed: ${response.status}`
          throw new Error(message)
        } catch {
          throw new Error(text || `Request failed: ${response.status}`)
        }
      }
      throw new Error(text || `Request failed: ${response.status}`)
    }
  }

  return (await response.json()) as T
}

export const extractArray = <T>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.items)) return payload.items
  return []
}

export const extractItem = <T>(payload: any): T | null => {
  if (!payload) return null
  if (payload.data && typeof payload.data === "object") return payload.data as T
  if (payload.item && typeof payload.item === "object") return payload.item as T
  return payload as T
}

export const extractMeta = (payload: any) => {
  const meta = payload?.meta || payload?.pagination || payload?.pageMeta || null
  return meta
}
