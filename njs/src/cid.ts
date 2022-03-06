import { CID } from 'multiformats/cid'

type CidPath = {
    cid: CID | null,
    path: String | null
}

function extractCidPath(re: RegExp, s: String): CidPath {
    const match = s.match(re)
    var result: CidPath = { cid: null, path: null }
    if (match && match.groups) {
        if (match.groups.cid) {
            try {
                result.cid = CID.parse(match.groups.cid)
                result.path = "/"
                // We set / as the path if there is a CID, but overwrite it below if we find a path in the URI
            } catch (e) {
                var message: string
                if (typeof e === "string") {
                    message = e
                } else if (e instanceof Error) {
                    message = `${e.name}: ${e.message}`
                } else {
                    message = "Unknown error type"
                }
                ngx.log(ngx.INFO, "CID parse fail: " + message)
            }
        }
        if (match.groups.has_path) {
            result.path = match.groups.has_path + match.groups.path
        }
    }
    return result
}

function URItoCidPath(uri: String): CidPath {
    const re = /^\/ipfs\/(?<cid>[\w+\-=]+)(?<has_path>\/|$)(?<path>\S*)$/
    return extractCidPath(re, uri)
}

function subdomainToCidPath(r: NginxHTTPRequest): CidPath {
    const domain = getDomain(r)
    const re = /^(?<cid>[\w+\-=]+)\.ipfs./
    const cid = extractCidPath(re, domain).cid
    const path = r.uri
    return { cid: cid, path: path }
}

export function getDomain(r: NginxHTTPRequest) {
    return String(r.variables.ssl_server_name || r.variables.host)
}

export function get_cid_string(r: NginxHTTPRequest) {
    const cid = URItoCidPath(r.uri).cid || subdomainToCidPath(r).cid
    return cid ? cid.toString() : ""
}

export function get_canonical_cid_string(r: NginxHTTPRequest): String {
    const cid = URItoCidPath(r.uri).cid || subdomainToCidPath(r).cid
    return cid ? cid.toV1().toString() : ""
}

export function get_unixfs_path(r: NginxHTTPRequest): String {
    const path = URItoCidPath(r.uri).path || subdomainToCidPath(r).path
    return path ? path : ""
}
