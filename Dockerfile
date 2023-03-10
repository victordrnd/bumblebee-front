FROM node:alpine As build
WORKDIR /usr/src/app
COPY package* ./
#RUN apk add build-base pkgconfig libusb-dev linux-headers eudev-dev
RUN npm ci --legacy-peer-deps --cache /tmp/npm-cache
COPY . .
RUN npm run build


FROM nginx:alpine as bumblebee-front
WORKDIR /usr/share/app
COPY --from=build /usr/src/app/dist/pt/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}                                                                                
EXPOSE 80
