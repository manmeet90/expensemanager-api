FROM node:10.0.0

COPY package.json package.json
RUN npm install

ENV MONGO_DB_URL=<db_conn_string>
ENV DB_NAME=expensemanager
ENV DEV_MODE=false

# Add your source files
COPY . .
CMD ["npm","start"]

EXPOSE 3000
