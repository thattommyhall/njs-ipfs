import 'core-js/actual/map'
import { get_canonical_cid_string, get_cid_string, get_unixfs_path } from './cid'
import { show } from './show'

// NOTE: This module must contain only the default export, no named exports!
// console.log(get_cid())
export default {
  get_canonical_cid_string, get_cid_string, get_unixfs_path, show
}
