import { getDomain } from './cid'
export function show (r: NginxHTTPRequest): void {
  r.headersOut['Content-Type'] = "application/json"
  return r.return(200, JSON.stringify({
    cid: r.variables.cid,
    canonical_cid: r.variables.canonical_cid,
    unixfs_path: r.variables.unixfs_path,
    domain: getDomain(r)
  }))
}
