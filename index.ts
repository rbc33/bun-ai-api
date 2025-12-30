const server = Bun.serve({
  port: process.env.PORT ?? 3000,
  async fetch(req){
    return new Response("Bun server it's running")
 }
})

console.log(`Server running at ${server.url}`)