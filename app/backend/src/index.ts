import { env } from "@/env";
import connectDB from "@/config/mongodb";
import { createServer } from "@/server";
import connectCloudinary from "@/config/cloudinary";

const PORT = env.PORT;

const bootstrap = async () => {
  await connectDB();
  connectCloudinary();

  const server = createServer();

  server.listen(PORT, () => {
    console.log(`API running on : ${PORT}`);
  });
};

bootstrap().catch((err) => {
  console.error("Failed to start server : ", err);
  process.exit(1);
});
