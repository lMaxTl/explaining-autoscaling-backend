# Expa Backend

## About
This is the backend for the Expa project. It is a REST API written in Node.js using the NestJS framework. It is currently in development.


## Running the backend locally
To run the backend locally, you need to have Node.js installed. You can download it from [here](https://nodejs.org/en/download/). After you have installed Node.js, you can run the backend by running the following commands in the root directory of the project:

```bash
$ npm install
$ npm run start:dev
```
However the backend will not work properly as it connects to a MongoDB database and to Promehteus both deployed on a cluster.
Thus it is not recommended to run the backend locally. Instead, you can deploy the backend directly to the cluster following the instructions below.

## Deploying the backend to the cluster
To deploy the backend to the cluster you need to have the following tools installed:
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

And you need a Kubernetes cluster. You can create one using [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/).

After you have installed and configured the tools, you can deploy the backend by running the following commands in the root directory of the project:

```bash
kubectl create -f ba-config.yml
kubectl create -f ba-deployment.yml
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

