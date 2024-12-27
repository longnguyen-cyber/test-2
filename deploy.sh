docker stop seim
docker rm seim
docker rmi seim
docker build -t seim:latest .
docker run -d --network=seim-api_default --name seim -p 3001:3001 seim