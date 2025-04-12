#!/bin/bash

aria2c \
  --enable-rpc \
  --rpc-listen-all=true \
  --rpc-allow-origin-all=true \
  --dir="$(pwd)/downloads" \
  --max-connection-per-server=16 \
  --split=10 \
  --min-split-size=1M
