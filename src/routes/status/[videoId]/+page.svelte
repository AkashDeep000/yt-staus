<script>
  export let data;
</script>

<h1 class="text-indigo-500">{data.post.title}</h1>
<div>{@html data.post.content}</div>