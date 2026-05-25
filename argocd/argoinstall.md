helm repo add argo https://argoproj.github.io/argo-helm
helm repo update



helm install argocd argo/argo-cd \
    --namespace argocd \
    --create-namespace



kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d


kubectl port-forward svc/argocd-server  -n argocd 8080:80 --address=0.0.0.0