import pb from "@/lib/pb";
export async function load() {
  const data = pb.collection("videos").getFullList(999999 /* batch size */, {
    sort: "created",
  });
  return { data };
}
