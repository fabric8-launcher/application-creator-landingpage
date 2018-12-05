#!/usr/bin/bash

CONFIG_TEMPLATE="/usr/bin/config-tmpl.json"
INDEX="/usr/share/nginx/html/index.html"

# process and export json settings from given template (escape double quotes, remove spaces and line breaks)
export JSON_CONFIG="$(envsubst < ${CONFIG_TEMPLATE} | tr -d '[:space:]' | sed 's/\"/\\\"/g')"

# create injected index.html with json settings
sed -i -e "s/<script id=\"script-injection\"><\/script>/<script id=\"injected-script\">$(echo $JSON_CONFIG | sed -e 's/[]\/$*.^[]/\\&/g')<\/script>/g" ${INDEX}
echo -------------------------------------
cat ${INDEX}

envsubst < /tmp/nginx.conf > /etc/nginx/nginx.conf
exec /run.sh
