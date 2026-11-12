/** A distributor call that failed (timeout, network, auth or server error). */
export class VendorError extends Error {
  constructor(
    readonly vendor: string,
    readonly status: number,
    message: string,
  ) {
    super(`${vendor}: ${message}`)
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * fetch for distributor APIs: a 15 s timeout (covering the response body too) so a slow distributor
 * can't hang a page, and one retry on rate limits (429) or server errors (5xx). Never cached by
 * Next.js; our own cache sits on top.
 */
export async function vendorFetch(vendor: string, url: string, init: RequestInit = {}) {
  for (let attempt = 0; ; attempt++) {
    let response: Response
    try {
      response = await fetch(url, {
        ...init,
        cache: 'no-store',
        signal: AbortSignal.timeout(15_000),
      })
    } catch (error) {
      if (attempt === 0) continue
      throw new VendorError(vendor, 0, `request failed (${(error as Error).name})`)
    }
    if ((response.status === 429 || response.status >= 500) && attempt === 0) {
      await sleep(600)
      continue
    }
    return response
  }
}
