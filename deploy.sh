sudo docker stop seim
sudo docker rm seim
sudo docker rmi seim
sudo docker build -t seim:latest .
sudo docker run -d --network=seim-network --name seim -p 3001:3001 seim