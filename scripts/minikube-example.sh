#!/bin/bash

# Ensure the API key is provided
if [ -z "$1" ]; then
  echo "Error: OpenAI API key not provided."
  echo "Usage: $0 -k <OPENAI_API_KEY>"
  exit 1
fi

# Usage notes
usage() {
  echo "Usage: $0 -k <OPENAI_API_KEY>"
  echo "  -k  OpenAI API key"
  exit 1
}

# Parse command-line arguments
while getopts ":k:" opt; do
  case $opt in
    k)
      OPENAI_API_KEY=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      usage
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      usage
      ;;
  esac
done

# Ensure the API key is provided
if [ -z "$OPENAI_API_KEY" ]; then
  echo "Error: OpenAI API key not provided."
  usage
fi

# Array of required commands
commands=("minikube" "kubectl" "helm")

# Check if each command is installed
for cmd in "${commands[@]}"; do
  if ! command -v $cmd &> /dev/null; then
    echo "Error: $cmd is not installed. Please install $cmd and try again."
    exit 1
  fi
done

# Start Minikube
minikube start
MINIKUBE_IP=$(minikube ip)

# Check if the namespace exists
kubectl get namespace thothscript &> /dev/null
if [ $? -ne 0 ]; then
  kubectl create namespace thothscript
fi

# Check if the Helm release for thothscript-operator exists and delete it if necessary
helm status thothscript-operator -n thothscript &> /dev/null
if [ $? -eq 0 ]; then
  helm uninstall thothscript-operator -n thothscript
fi

helm repo add jordojordo https://jordojordo.github.io/helm-charts
helm repo update

# Install thothscript-operator
helm install thothscript-operator jordojordo/thothscript-operator \
  --namespace thothscript \
  --set env.OPENAI_API_KEY=$OPENAI_API_KEY

# Wait for thothscript-operator deployment to be ready
echo "Waiting for thothscript-operator deployment to be ready..."
kubectl rollout status deployment/thothscript-operator -n thothscript

# Check if the Helm release for thothscript-ui exists and delete it if necessary
helm status thothscript-ui -n thothscript &> /dev/null
if [ $? -eq 0 ]; then
  helm uninstall thothscript-ui -n thothscript
fi

# Deploy thothscript-ui with Helm
helm install thothscript-ui jordojordo/thothscript \
  --namespace thothscript \
  --set ingress.controller.install=true \
  --set service.type=NodePort

# Wait for thothscript-ui deployment to be ready
echo "Waiting for thothscript-ui deployment to be ready..."
kubectl rollout status deployment/thothscript-ui -n thothscript

# Wait for the Service to be created and fetch the NodePort
SERVICE_NAME=$(kubectl get svc -n thothscript -l "app.kubernetes.io/instance=thothscript-ui" -o jsonpath="{.items[0].metadata.name}")
NODE_PORT=$(kubectl get svc $SERVICE_NAME -n thothscript -o jsonpath="{.spec.ports[0].nodePort}")

# Upgrade thothscript-ui deployment with NodePort information
helm upgrade thothscript-ui jordojordo/thothscript \
  --namespace thothscript \
  --set env.THOTHSCRIPT_PROXY_PORT=$NODE_PORT \
  --set env.THOTHSCRIPT_PROXY_HOST=$MINIKUBE_IP \
  --set service.type=NodePort

# Wait for thothscript-ui deployment to be ready
echo "Waiting for thothscript-ui deployment upgrade to be ready..."
kubectl rollout status deployment/thothscript-ui -n thothscript

# Display the application access URL
echo "Your application should now be accessible at http://$MINIKUBE_IP:$NODE_PORT"
