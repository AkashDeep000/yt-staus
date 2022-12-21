import pb from "@/lib/pb"
export function load({ params }) {
  
  return {
    post: {
      title: `Title for ${params.videoId} goes here`,
      content: `Content for ${params.videoId} goes here`,
    },
  };
}
