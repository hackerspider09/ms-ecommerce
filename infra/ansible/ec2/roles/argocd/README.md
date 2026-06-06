#  How did i found data like how and why server.extr why --rootpath etc

https://argo-cd.readthedocs.io/en/latest/operator-manual/ingress/#argo-cd-server-and-ui-root-path-v153 here it mentioned if you want to acecss argo cd on non root path use --rootpath
which is passed to container which container -> server argocd server this is cmd argument 

if i am using helm i will use official argocd https://github.com/argoproj/argo-helm/blob/main/charts/argo-cd/
in this go to values.yaml -> 1997 server: -> 2095 extraArgs this use to pass cmd line args to server conatiner and we can pss --rootpath value from here
for confirmnation in templates/argocd-server/deployment.yaml -> at 78 you can see its using those args

and there is another way https://argo-cd.readthedocs.io/en/latest/operator-manual/ingress/ by configmap create file of kind configmap and pass server.basehref and rootpath got info from : https://argo-cd.readthedocs.io/en/latest/operator-manual/argocd-cmd-params-cm-yaml/ see about basehref and rootpath