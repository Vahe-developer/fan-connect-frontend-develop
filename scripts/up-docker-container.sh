#!/usr/bin/env bash

ENV=${1:-stage}
HOST=${2:-ubuntu@ec2-18-184-4-9.eu-central-1.compute.amazonaws.com}
DOCKER_REGISTRY_USER=${3:-deployer}
DOCKER_REGISTRY_PASS=${4:-password}
COMMIT=${5:-develop}
SOURCE=${6:-registry.gitlab.com/my-fan/fan-connect-frontend}

ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=120 $HOST /bin/bash << EOF
  docker login -u "$DOCKER_REGISTRY_USER" -p "$DOCKER_REGISTRY_PASS" registry.gitlab.com && \
  docker pull $SOURCE:$COMMIT && \
  docker rm -vf fan-connect-frontend || echo "Container not found" && \
  docker run --name fan-connect-frontend -d --restart always -p "8056:80" $SOURCE:$COMMIT
EOF

