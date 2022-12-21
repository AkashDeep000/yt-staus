<script>
	// your script goes here
	import Icon from 'svelte-icons-pack/Icon.svelte';
	import CgSearch from "svelte-icons-pack/cg/CgSearch";
	import AiOutlinePaperClip from "svelte-icons-pack/ai/AiOutlinePaperClip";
	import HiSolidTrendingUp from "svelte-icons-pack/hi/HiSolidTrendingUp";

	import pb from "@/lib/pb";
	import axios from "axios"
	import Clipboard from "svelte-clipboard";
  import { PUBLIC_URL } from '$env/static/public'
  import { invalidateAll } from '$app/navigation';

	export let data;
	console.log(data)
	let videoUrl = "";
	let videoInfo;
	let getInfoState = "idle"
	let addVideoState = "idle"
	let currentCopy;
	
	const getInfo = async () => {
	  if (videoUrl === "") return
	  getInfoState = "loading";
	  try {
	  const res = await axios.get(`/api?url=${videoUrl}`)
	  getInfoState = "success";
	  videoInfo = res.data
	  console.log(videoInfo)
	  } catch(e) {
	    console.log(e)
	    getInfoState = "error"
	  }
	}
	
	const addVideo = async () => {
	  try {
	    addVideoState = "loading"
	    const record = await pb.collection('videos').create({
          title: videoInfo.title,
          thumb: videoInfo.thumb[3]?.url,
          url: videoUrl,
          videoId: videoInfo.videoId,
          data: [{
            time: new Date(),
            views: videoInfo.views,
            visitor: 0,
          }],
        });
        addVideoState = "success"
        invalidateAll();
        getInfoState = "idle"
        
	  } catch (e) {
	    console.log(e)
	    addVideoState = "error"
	    getInfoState = "idle"
	  }
	}
	/*
	
*/
</script>
	<h1 class="text-center font-semibold text-xl text-accent-focus bg-white shadow p-3 sticky">ADMIN</h1>
<div class="p-4">

	<div class="p-4 bg-white rounded shadow">
	<div class="grid grid-cols-[1fr_auto] gap-2">
		<input
			type="text"
			bind:value={videoUrl}
		  placeholder="Enter Video URL"
			class="input input-bordered input-accent w-full"
		/>
		<button 
		  on:click={() => getInfo()}
		  class="py-2 px-3 bg-accent hover:outline hover:outline-offset-2 hover:outline-accent hover:outline-2 rounded-lg shadow">
		<Icon src={CgSearch} className="w-6 h-6 text-white"/>
		</button>
	</div>
	</div>
	{#if getInfoState !== "idle"}
	{#if getInfoState === "error"}
	<p class="mt-4 rounded text-rose-500 border border-rose-500 p-2">Failed to fetch video information</p>
	{/if}
	{#if getInfoState !== "error"}
	<div class="mt-4 shadow rounded-md p-4 w-full mx-auto border-2 border-accent border-dashed">
  <div class={`${getInfoState === "loading" && "animate-pulse"} flex space-x-4`}>
    <div class="rounded bg-slate-200 h-24 aspect-video">
      {#if videoInfo}
      <img class="object-contain" src={videoInfo?.thumb[3]?.url}/>
      {/if}
    </div>

      {#if getInfoState === "loading"}
          <div class="flex-1 space-y-6 py-1">
      <div class="h-2 bg-slate-200 rounded"></div>
      <div class="space-y-3">
        <div class="grid grid-cols-3 gap-4">
          <div class="h-2 bg-slate-200 rounded col-span-2"></div>
          <div class="h-2 bg-slate-200 rounded col-span-1"></div>
        </div>
        <div class="h-2 bg-slate-200 rounded"></div>
      </div>
      </div>
      {:else}
      <div class="space-y-3">
      <p class="text-slate-800 line-clamp-2">
        {videoInfo.title}
      </p>
      <div class="w-full">
        <button 
        on:click={() => addVideo()}
        class="bg-accent text-white text-lg w-full py-1 px-2 shadow rounded hover:outline hover:outline-offset-2 hover:outline-accent hover:outline-2">
          {addVideoState === "loading"? "Adding..." : "Add"}
        </button>
      </div>
      </div>
      {/if}
  </div>
</div>
{/if}
{/if}
{#each data.data as video}
	<div class="mt-4 shadow rounded-md p-4 w-full mx-auto bg-white">
  <div class={`flex space-x-4`}>
    <div class="rounded bg-slate-200 h-24 aspect-video">

      <img class="object-contain" src={video.thumb}/>
    </div>
      <div class="space-y-3">
      <p class="text-slate-800 line-clamp-2">
        {video.title}
      </p>
      <div class="w-full grid grid-cols-[1fr_auto]">
        <div class="flex gap-1">
    		<Icon src={HiSolidTrendingUp} className="w-6 h-6 stroke-accent"/>
    <p class="text-gray-700 text-xl font-monospace">{video.visitor}</p>
    </div>
		<Clipboard
  text={`${PUBLIC_URL}/status/${video?.videoId}`}
  let:copy
  on:copy={() => {
    console.log('Has Copied');
    currentCopy = video.videoId;
    setTimeout(() => {
    currentCopy = ""
    }, 200)
  }}>
  <button on:click={copy} class={`py-1 px-2 border border-accent ${currentCopy === video.videoId && "outline outline-offset-2 outline-accent outline-2"} rounded-lg shadow`}>
   		<Icon src={AiOutlinePaperClip} className="w-6 h-6 fill-accent"/>
  </button>
</Clipboard>
      </div>
      </div>

  </div>
</div>
{/each}
</div>
