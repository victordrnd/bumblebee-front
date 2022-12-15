FROM node:alpine As build
WORKDIR /usr/src/app
COPY package.json ./
RUN apk add build-base pkgconfig libusb-dev linux-headers eudev-dev
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build


FROM nginx:alpine as bumblebee-front
WORKDIR /usr/share/app
COPY --from=build /usr/src/app/dist/pt/ /usr/share/nginx/html
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}                                                                                
#CMD ["dist/src/main"]
EXPOSE 80
