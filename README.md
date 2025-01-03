name: CI/CD

on:
push:
branches: [master]
workflow_dispatch:

jobs:
build:
runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x]
    steps:
      - uses: actions/checkout@v2

      - name: Test SSH Connection
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" | tr -d '\r' > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh -o StrictHostKeyChecking=no ${{ secrets.USER }}@${{ secrets.HOST }} 'echo "SSH connection successful"'

      - name: Chmod file
        run: |
          sudo chmod +x ./start-containers.sh
          sudo chmod +x ./rundb.sh
          sudo chmod +x ./deploy.sh

      - name: Deploy using ssh
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: 22
          script: |
            # correct the directory path
            cd ~/app

            git restore .

            # Ensure the code is present (it's assumed it's a git repository
            git pull origin master

            # Run database migrations
            ./rundb.sh

            # Restart the container
            ./start-containers.sh

            # Build docker image
            ./deploy.sh

// no push to docker hub
