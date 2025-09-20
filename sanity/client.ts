import { createClient } from "next-sanity";
import { groq } from "next-sanity"

export const sanityClient = createClient({
  projectId: "4jwni4ex",
  dataset: "production",
  apiVersion: "2025-09-01",
  useCdn: false,
});


// helper for GROQ queries
export { groq }