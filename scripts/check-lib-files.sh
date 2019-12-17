#!/usr/bin/env sh

RED='\033[0;31m'
NC='\033[0m' # No Color

if git diff --exit-code --staged --name-only lib; then
    echo "Everything is fine with staged libs"
else
    echo "
        ${RED}`git diff --exit-code --name-only --staged lib`${NC}\n

        Folder lib was modified , please publish to npm before comitting changes.
        Change version in package.json then use 'npm publish' command.
    "  | sed  -e 's/^/  /'
fi
