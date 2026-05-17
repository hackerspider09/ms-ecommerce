minikube start --driver=docker


## stop cluster (keeps state)
minikube stop

## delete cluster (full reset)
minikube delete


kubectl run -it --rm --restart=Never debug --image=busybox:latest -- sh

wget https://github.com