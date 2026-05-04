import connectCloudinary from "@/config/cloudinary";
import connectDB from "@/config/mongodb";
import { env } from "@/env";
import { createServer } from "@/server";

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
