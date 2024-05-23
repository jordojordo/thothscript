#!/bin/sh

# Provide default values for KUBESCRIPT_API if it's not set
: "${KUBESCRIPT_API:=localhost:3000/ws}"

# Replace placeholder in index.html with the actual value of KUBESCRIPT_API
sed -i "s|__KUBESCRIPT_API__|${KUBESCRIPT_API}|g" /app/index.html

# Substitute environment variables in nginx.conf.template and create nginx.conf
sed "s|\$KUBESCRIPT_API|$KUBESCRIPT_API|g" /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Create config.js with the environment variable
cat <<EOF > /app/config.js
window.config = {
  KUBESCRIPT_API: "$KUBESCRIPT_API"
};
EOF

# Print the resulting nginx.conf for debugging
cat /etc/nginx/nginx.conf

# Start Nginx
nginx -g 'daemon off;'
