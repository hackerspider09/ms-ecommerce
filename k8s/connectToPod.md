## Connect to postgres container
```
kubectl exec -it <pod-name> -n <your-namespace> -- psql -U <postgres-user> -d <db-name>
kubectl exec -it orderdb-st-0 -n ms-ecom-application -- psql -U admin -d orderdb
```

or can use sh and then login to postgres
```
kubectl exec -it orderdb-st-0 -n ms-ecom-application -c orderdb -- sh
```
then run login cmd
`
psql -U admin -d orderdb
`