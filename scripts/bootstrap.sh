#!/usr/bin/env bash
# Deprecated — use ./setup.sh at the project root instead.
exec "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/setup.sh" "$@"
