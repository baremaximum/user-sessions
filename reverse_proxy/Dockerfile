FROM baremaximum/nginx-reverse-proxy:latest

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]