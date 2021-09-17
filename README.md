# dpkg-status-ui

A React+Express application showing packag information extracted from `/var/lib/dpkg/status` file found in Debian and
Ubuntu systems via web ui.

![Alt text](./demo.PNG?raw=true "Demo")

## Requirements
![Alt text](./req.PNG?raw=true "Requirements")

## Getting started

Clone the project:

```
git clone https://github.com/hzski2008/dpkg-status-ui
```

Install dependencies:
```
cd backend && npm install
cd frontend && npm install
```

## Get it up and running

```
./startBackendServer.sh && ./startUi.sh
```

