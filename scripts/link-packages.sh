#!/usr/bin/env sh

PACKGE_NAMES="auth base clients commons pages store validation web-components"

for package in ${PACKGE_NAMES}; do
  yarn link @myfan/"${package}"
done
