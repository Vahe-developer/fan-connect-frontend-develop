#!/usr/bin/env sh
DIRECTORY=${1}
#CI_BUILD_REF=${2}
#CI_BUILD_TOKEN=${3}
STAGE=${4}
HOST=${5}

if apk add --update curl && rm -rf /var/cache/apk/* && ./scripts/sync-translations.sh "${HOST}" >/dev/null; then
  echo "succeeded"
else
  exit 2
fi
if apk add --update curl && rm -rf /var/cache/apk/* && ./scripts/get-configs.sh "${HOST}" >/dev/null; then
  echo "succeeded"
else
  exit 2
fi

if docker run -v "${DIRECTORY}":/workspace --workdir=/workspace node:12.13.0 yarn; then
  echo "succeeded"
else
  exit 2
fi
if docker run -v "${DIRECTORY}":/workspace --workdir=/workspace node:12.13.0 yarn build-"${STAGE}"; then
  echo "succeeded"
else
  exit 2
fi
if docker ps -a --filter "exited=0" | grep runner | xargs docker rm -v; then
  echo "Cleaning exited runner containers Done!"
else
  echo "No exited runner containers found"
fi
echo "User-agent: *" >"${DIRECTORY}"/build/robots.txt
echo "Disallow: /" >>"${DIRECTORY}"/build/robots.txt
