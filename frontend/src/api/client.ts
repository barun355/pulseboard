const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"

let _getToken: (() => Promise<string | null>) | null = null

export function initApiClient(getToken: () => Promise<string | null>) {
  _getToken = getToken
}

export class ApiClientError extends Error {
  status: number
  code?: string
  details?: string[]

  constructor(
    status: number,
    message: string,
    code?: string,
    details?: string[],
  ) {
    super(message)
    this.name = "ApiClientError"
    this.status = status
    this.code = code
    this.details = details
  }
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (_getToken) {
    const token = await _getToken()
    if (token) headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string>),
    },
  })

  if (response.status === 204) return undefined as T

  const json = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiClientError(
      response.status,
      json.error?.message || json.message || `Request failed (${response.status})`,
      json.error?.code,
      json.error?.details,
    )
  }

  return json.data !== undefined ? json.data : json
}
