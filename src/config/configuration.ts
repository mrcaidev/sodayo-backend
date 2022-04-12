export function configuration() {
  return {
    port: +process.env.PORT ?? 3000,
    db: {
      host: process.env.DB_HOST ?? "localhost",
      port: +process.env.DB_PORT ?? 5432,
      name: process.env.DB_NAME ?? "",
      user: process.env.DB_USER ?? "",
      password: process.env.DB_PASSWORD ?? "",
    },
    jwt: {
      secret: process.env.JWT_SECRET ?? "",
    },
  };
}
