# Faucet endpoint example

A minimal example of a faucet endpoint, using the sdk on nodejs, showcasing its capabilities. Allows to send a fixed amount of adas to the requested addresses.

## Instructions

### Install dependencies

1. Build the sdk for nodejs target, in the root directory of this repository run:

```sh
wasm-pack build --target nodejs --out-dir ./examples/faucet/js-chain-libs/
```

2. Install the example node dependencies:

In the root directory of the faucet example run: `npm install`

### Configuration

The following variables can be set in file named `.env` to configure the behaviour.

- JORMUNGANDR_API: The url where a jormungandr instance is listening for the rest api.
- SECRET_KEY: The secret key of the faucet account.
- PORT: Port to listen to for requests.
- LOVELACES_TO_GIVE: Fixed amount of lovelaces to give at each request.

For example (.env file):

```plaintext
JORMUNGANDR_API=http://localhost:8443/api/v0
SECRET_KEY=ed25519e_sk1qp2qdlkk3qnj58es5v6wx0ngvxtg5lvyxqg255mjg04qjr7l93fxpmxlldxuu6jjghuwmfuqg3kqglghk4vk54jyfkgt3l8ttm5pgtck9yhrr
PORT=3000
LOVELACES_TO_GIVE=300
```

### Run the server

`npm run server`

### Usage example 

```sh
curl -X POST http://localhost:3000/send-money/ca1sw6gu33yw73dr60f2ehp6xemgf30r49rzc25gkrfnrfuuyf0mycgjzfvl88
```

## Offered API

POST: /send-money/:destinationAddress

Sends the configured amount of lovelaces to the given address.

 - destinationAddress the address to send money to in string represenation

## Possible improvements

- Add a frontend that uses the endpoint using the sdk for address validation.
- Better error handling.