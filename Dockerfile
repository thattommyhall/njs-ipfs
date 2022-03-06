FROM ubuntu:20.04

RUN apt update
RUN apt -y install --no-install-recommends curl gnupg2 ca-certificates lsb-release ubuntu-keyring less
RUN curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor > /usr/share/keyrings/nginx-archive-keyring.gpg

RUN echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" >  /etc/apt/sources.list.d/nginx.list

RUN echo "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" > /etc/apt/preferences.d/99nginx

RUN apt update
RUN apt install nginx nginx-module-njs nginx-module-njs-dbg
COPY nginx.conf /etc/nginx/nginx.conf
RUN mkdir /etc/nginx/njs
COPY njs/bundle.js  /etc/nginx/njs/bundle.js
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]