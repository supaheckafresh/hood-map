!# /bin/bash

echo "Installing npm dependencies."
npm install

echo "Installing bower dependencies."
bower update

echo "Building application."
gulp

echo "The application is ready to use at http://localhost:3000"