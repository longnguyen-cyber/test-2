docker stop seim
docker rm seim
docker rmi seim
docker build -t seim:latest .
docker run -d --network=seim-network --name seim -p 3002:3002 seim