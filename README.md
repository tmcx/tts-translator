<p align="center">
  <img src="https://i.ibb.co/6WpTD86/logo-1.png" width="300" height="auto" title="TTS-Translator">
</p>

## Description
TTS-Translator is a Docker image that contains an API for translating text and converting text to speech. It also provides the functionality to combine both actions to provide text-to-speech translation.

## Environment Variables
- **LT_LOAD_ONLY**: Defines the languages to be installed. Example: `"en,es"`
- **API_PORT**: Defines the port of the API. Example: `"8080"`

## Features
- Text translation.
- Text-to-speech conversion.
- Text-to-speech translation.

## Endpoints
- **POST /tts**: Translates and/or transforms to text-to-speech. 
    - HTTP Body:
    ```json
    {
        "text": "Hello world!",           // [Required] Text to use
        "voice": {                        // [Optional] Voice configuration
            "name" : "es-AR-TomasNeural", // TTS voice. To list it use /tts/voices endpoint.
            "volume": -50,                 // Voice volume
            "pitch": -10,                 // Voice pitch
            "rate": -10                   // Voice rate
        },
        "translate": {                    // [Optional] Translation configuration
            "from": "en",                 // Source language
            "to": "es"                    // Target language
        }
    }
    ```
- **GET /tts/voices**: Retrieves the voices available for text-to-speech.
- **POST /translate**: Translates text.
    - HTTP Body:
    ```json
    {
        "text": "Hello world!",           // [Required] Text to use
        "from": "en",                     // [Required] Source language. To list it use /translate/languages endpoint.
        "to": "es"                        // [Required] Target language. To list it use /translate/languages endpoint.
    }
    ```
- **GET /translate/languages**: Retrieves the languages available for translate.

## Usage
To run this Docker image, you can use the following command:

```bash
docker run -d -e LT_LOAD_ONLY="en,es" -e API_PORT="8080" -p 8080:8080 tmcx/tts-translator:latest
```

## Author
[TMCX](https://github.com/tmcx)

## Repository
The source code of this project is available on [GitHub](https://github.com/tmcx/tts-translator).

## License
This project is licensed under the [LGPL-3 License](https://www.gnu.org/licenses/lgpl-3.0.html) for commercial use without the obligation to share the source code.