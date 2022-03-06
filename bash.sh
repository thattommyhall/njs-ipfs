#!/bin/bash
set -euo pipefail
# set -x

docker build . -t njs-spike
docker run -it --mount type=bind,source="$(pwd)",target=/app --entrypoint /bin/bash njs-spike 