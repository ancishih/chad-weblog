#! /bin/bash

test -n "$APIKEY" && test -n "$BASE_URL" && test -n "$APP_ENDPOINT"

find /app/ \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i \
 -e "s#PUBLIC_APIKEY#$APIKEY#g" \
 -e "s#PUBLIC_BASE_URL#$BASE_URL#g" \
 -e "s#PUBLIC_APP_ENDPOINT#$APP_ENDPOINT#g"

exec "$@"