#!/usr/bin/env sh

HOST=${1-"fcspstage.myfan.co"}

curl https://"${HOST}"/api/v2/settings/public -o src/configs/config.json
