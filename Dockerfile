FROM libretranslate/libretranslate:latest


USER root

# TTS configuration
RUN mkdir /tts
RUN pip install --upgrade pip
RUN python3 -m pip install pipx
RUN pipx install edge-tts
ENV PATH="/root/.local/bin:$PATH"


# NodeJS configuration
RUN apt-get update && apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install nodejs -y

# API configuration
RUN npm install -g typescript
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build
RUN rm -rf src
EXPOSE 8080

ENV LT_LOAD_ONLY=es,en
ENV LT_PORT=8089

ENTRYPOINT ["npm", "start"]