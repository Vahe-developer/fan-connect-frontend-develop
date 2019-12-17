#!/usr/bin/env bash
BUILD_DIR=${1}
BUCKET=${2}
DISTRIBUTION_ID=${3}

echo "aswcli installation"
pip install awscli
echo "Deploying Frontend to Amazone CDN"
if aws s3 sync --acl public-read ${BUILD_DIR} s3://${BUCKET}; then
    echo  "succeeded"
else
    exit 2
fi
if aws configure set preview.cloudfront true; then
    echo  "succeeded"
else
    exit 2
fi
if aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths '/*'; then
    echo  "succeeded"
else
    exit 2
fi
echo "Deployed Successfully"