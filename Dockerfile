FROM node:alpine As build
WORKDIR /usr/src/app
COPY package.json ./
RUN apk add build-base pkgconfig libusb-dev linux-headers eudev-dev
RUN npm install
COPY . .
RUN npm run build


FROM nginx:alpine as bumblebee-front
WORKDIR /usr/share/app
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/aston-villa-app /usr/share/nginx/html
COPY --from=my-app-build /app/dist/app-to-run-inside-docker /usr/share/nginx/html
ARG NODE_ENV=production2.
ENV NODE_ENV=${NODE_ENV}                                                                                
CMD ["dist/src/main"]
EXPOSE 80
