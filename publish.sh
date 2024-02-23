VERSION=$(cat ./version)

docker build -t "tmcx/tts-translator:$VERSION" .
docker push "tmcx/tts-translator:$VERSION"

docker build -t "tmcx/tts-translator:latest" .
docker push "tmcx/tts-translator:latest"