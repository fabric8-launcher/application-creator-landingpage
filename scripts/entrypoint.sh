#!/bin/bash

CONFIG_TEMPLATE="/usr/bin/config-tmpl.json"
INDEX="/usr/share/nginx/html/index.html"

export WELCOME_APP_CONFIG_ENCODED = echo ${WELCOME_APP_CONFIG} | tr -d '[:space:]' | sed 's/\"/\\\"/g' | sed s/\'/\\\'/g

# create injected index.html with json settings
sed -i -e "s/<script id=\"script-injection\"><\/script>/<script id=\"injected-script\">$(envsubst < ${CONFIG_TEMPLATE} | tr -d '[:space:]' | sed -e 's/[]\/$*.^[]/\\&/g')<\/script>/g" ${INDEX}
echo -------------------------------------
cat ${INDEX}

envsubst < /tmp/nginx.conf > /etc/nginx/nginx.conf
exec /run.sh
