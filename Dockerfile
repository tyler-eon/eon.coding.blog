FROM node:14.4

RUN mkdir -p /home/blog

WORKDIR /home/blog

RUN npm install -g @codedoc/cli
RUN codedoc init
RUN cd .codedoc && npm install @codedoc/coding-blog-plugin

CMD ["codedoc", "serve"]
