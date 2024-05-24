#!/bin/sh

# Provide default values for CLIENT_THOTHSCRIPT_API if it's not set
: "${CLIENT_THOTHSCRIPT_API:=localhost:3000/ws}"

# Substitute environment variables in nginx.conf.template and create nginx.conf
sed "s|__CLIENT_THOTHSCRIPT_API__|http:\/\/$CLIENT_THOTHSCRIPT_API|g" /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

for i in $(env | grep CLIENT_); do
  key=$(echo $i | cut -d '=' -f 1)
  value=$(echo $i | cut -d '=' -f 2-)
  echo $key=$value

  # sed JS and CSS only
  find /app/assets -type f \( -name '*.js' -o -name '*.css' \) -exec sed -i "s|${key}|${value}|g" '{}' +
done

# Print the resulting nginx.conf for debugging
cat /etc/nginx/nginx.conf

# Start Nginx
nginx -g 'daemon off;'
