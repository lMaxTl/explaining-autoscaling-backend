cd ..
docker build -t ba-backend .
docker tag ba-backend maximeschwarzer/ba-backend:latest
docker push maximeschwarzer/ba-backend:latest