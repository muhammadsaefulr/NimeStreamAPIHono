FROM oven/bun:1

WORKDIR /app

COPY . .

RUN bun install
 
ARG PORT
EXPOSE ${PORT:-8020}
 
CMD ["bun", "run", "src/index.ts"]