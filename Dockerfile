FROM node:10.14.0-jessie
RUN mkdir /documentbuilder-integration-example-nodejs
WORKDIR /documentbuilder-integration-example-nodejs
COPY . /documentbuilder-integration-example-nodejs
RUN apt update && apt install -y fonts-dejavu ttf-dejavu fonts-opensymbol
RUN wget https://download.onlyoffice.com/install/desktop/docbuilder/linux/onlyoffice-documentbuilder_amd64.deb
RUN  dpkg -i onlyoffice-documentbuilder_amd64.deb
RUN npm install
CMD node main.js