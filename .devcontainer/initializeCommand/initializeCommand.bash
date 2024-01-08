#!/usr/bin/env bash

set -euo pipefail

WORKSPACE=$(pwd)

cat << EOS

================================================================================
Checking prerequisites...
================================================================================
EOS

if [ ! -f cms/.env ]; then
  echo "cms/.env が存在しません。cms/.env.example からコピーして作成します。"
  cp cms/.env.example cms/.env
fi

if [ ! -f frontend/.env.runtime ]; then
  echo "frontend/.env.runtime が存在しません。frontend/.env.runtime.example からコピーして作成します。"
  cp frontend/.env.runtime.example frontend/.env.runtime
fi

echo "Check OK"
