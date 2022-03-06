#!/bin/bash
set -euo pipefail
# set -x
cd njs
npm run build
cd ..
docker build . -t njs-spike
docker run -it -p 3000:80 njs-spike 