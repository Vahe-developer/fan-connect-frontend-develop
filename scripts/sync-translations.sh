#!/usr/bin/env sh

HOST=${1-"fcspdemo.myfan.co"}

echo "Getting translations from \"${HOST}\""

curl https://"${HOST}"/api/v2/translations/lang/de -o src/translations/de.json
curl https://"${HOST}"/api/v2/translations/lang/en -o src/translations/en.json

echo "Done"
