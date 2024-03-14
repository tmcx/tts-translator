VERSION=$(cat ./version)

docker build --network host -t "tmcx/tts-translator:$VERSION" .
docker push "tmcx/tts-translator:$VERSION"

docker build --network host -t "tmcx/tts-translator:latest" .
docker push "tmcx/tts-translator:latest"