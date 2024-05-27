#!/bin/sh


# Provide default values for CLIENT_THOTHSCRIPT_API_SCHEME, CLIENT_THOTHSCRIPT_API_HOST, CLIENT_THOTHSCRIPT_API_PORT, and CLIENT_THOTHSCRIPT_API_PATH if not set
: "${CLIENT_THOTHSCRIPT_PROXY_SCHEME:=ws}"
: "${CLIENT_THOTHSCRIPT_PROXY_HOST:=localhost}"
: "${CLIENT_THOTHSCRIPT_PROXY_PORT:=80}"
: "${CLIENT_THOTHSCRIPT_PROXY_PATH:=/ws/}"

# Provide default values for CLIENT_THOTHSCRIPT_OPERATOR_HOST, CLIENT_THOTHSCRIPT_OPERATOR_NAMESPACE, and CLIENT_THOTHSCRIPT_OPERATOR_PORT if not set
: "${CLIENT_THOTHSCRIPT_OPERATOR_HOST:=thothscript-operator}"
: "${CLIENT_THOTHSCRIPT_OPERATOR_NAMESPACE:=thothscript}"
: "${CLIENT_THOTHSCRIPT_OPERATOR_PORT:=3000}"

# Substitute environment variables in nginx.conf.template and create nginx.conf
sed -e "s|__CLIENT_THOTHSCRIPT_OPERATOR_HOST__|${CLIENT_THOTHSCRIPT_OPERATOR_HOST}|g" \
    -e "s|__CLIENT_THOTHSCRIPT_OPERATOR_NAMESPACE__|${CLIENT_THOTHSCRIPT_OPERATOR_NAMESPACE}|g" \
    -e "s|__CLIENT_THOTHSCRIPT_OPERATOR_PORT__|${CLIENT_THOTHSCRIPT_OPERATOR_PORT}|g" \
    /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

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
