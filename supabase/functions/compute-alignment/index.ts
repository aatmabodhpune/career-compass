import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleRequest } from "./controller.ts";

serve(async (req: Request) => {
  return await handleRequest(req);
});
