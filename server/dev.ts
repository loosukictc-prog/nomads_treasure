import { createServer } from "./index";

const app = createServer();
const port = process.env.PORT || 8080;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`\n✅ Express API Server running on http://${host}:${port}`);
  console.log(`   📌 API endpoints: http://${host}:${port}/api`);
  console.log(`   🔍 Health check: http://${host}:${port}/api/health\n`);
});
