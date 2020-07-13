FROM node:carbon

WORKDIR /home/r1oga/dev/udemy/junior-to-senior/smartbrain/api

COPY ./ ./

RUN yarn install

CMD ["/bin/bash"]