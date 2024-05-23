#!/bin/sh

# Provide default values for THOTHSCRIPT_API if it's not set
: "${THOTHSCRIPT_API:=localhost:3000/ws}"

# Replace placeholder in index.html with the actual value of THOTHSCRIPT_API
sed -i "s|__THOTHSCRIPT_API__|${THOTHSCRIPT_API}|g" /app/index.html

# Substitute environment variables in nginx.conf.template and create nginx.conf
sed "s|\$THOTHSCRIPT_API|$THOTHSCRIPT_API|g" /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Create config.js with the environment variable
cat <<EOF > /app/config.js
window.config = {
  THOTHSCRIPT_API: "$THOTHSCRIPT_API"
};
EOF

# Print the resulting nginx.conf for debugging
cat /etc/nginx/nginx.conf

# Start Nginx
nginx -g 'daemon off;'
