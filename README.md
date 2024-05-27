# ThothScript

## Overview

ThothScript is a chatbot application that allows you to interact with the [ThothScript-operator](https://github.com/jordojordo/thothscript-operator), which implements GPTScript on a Kubernetes cluster with `kubectl` and `helm` capabilities. This application enables users to automate tasks using natural language instructions, providing an intuitive way to manage Kubernetes resources.

## Features

- Chatbot interface to interact with ThothScript-operator
- Supports natural language scripting with GPTScript
- Kubernetes resource management with `kubectl` and `helm`
- Flexible task automation and orchestration

## Installing with Helm

To deploy the ThothScript UI on a Kubernetes cluster using the Helm chart, follow these steps:

1. Add the Helm repository (if applicable):

```bash
helm repo add jordojordo https://jordojordo.github.io/helm-charts
helm repo update
```

2. Install the Helm chart with the release name my-release:

```bash
helm install thothscript-ui jordojordo/thothscript
```

### Configuration

The Helm chart allows for a variety of configurations. Refer to the values.yaml file for a list of configurable parameters and their default values. Key environment variables include:

- THOTHSCRIPT_PROXY_HOST: The host URL for the proxy. This should be set to the service address where the frontend is served from.
- THOTHSCRIPT_PROXY_PORT: The port for the proxy.
- THOTHSCRIPT_OPERATOR_HOST: The host URL for the ThothScript operator within the cluster.
- THOTHSCRIPT_OPERATOR_PORT: The port for the ThothScript operator within the cluster.

For more detailed information on configuration, refer to the [Helm chart documentation](https://github.com/jordojordo/helm-charts/tree/master/charts/thothscript).

## Development

To get started with ThothScript, clone the repository and install the dependencies:

```bash
git clone https://github.com/jordojordo/thothscript.git
cd thothscript
yarn
```

## Usage
To run the development server:

```bash
yarn dev
```

To build the application for production:

```bash
yarn build
```

## Contributing
Contributions are welcome! Please read the contributing guidelines before submitting pull requests.
