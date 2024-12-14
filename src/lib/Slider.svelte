<!-- src/lib/Slider.svelte -->
<script lang="ts">
	import { type SliderProps as Props } from './types';
	let { value = $bindable(), max = 10, min = 1, step = 1 }: Props = $props();

	let track: HTMLDivElement;
	let thumb: HTMLDivElement;
	let isDragging = $state(false);
	let offsetX = $state(0);

	const percentage = $derived.by(() => ((value - min) / (max - min)) * 100);

	function handlePointerDown(e: PointerEvent) {
		isDragging = true;
		offsetX = e.offsetX;
		e?.preventDefault();
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging) return;

		const trackWidth = track.offsetWidth;
		const thumbWidth = thumb.offsetWidth;
		let newPercentage = Math.min(
			Math.max(0, ((e.clientX - track.offsetLeft - offsetX) / trackWidth) * 100),
			100
		);
		value = Math.round((newPercentage / 100) * (max - min) + min);
		value = Math.round(value / step) * step;
	}

	function handlePointerUp(e: PointerEvent) {
		isDragging = false;
	}
</script>

<div
	class="slider"
	bind:this={track}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointerleave={handlePointerUp}
>
	<div
		class="track"
		style="background: linear-gradient(to right, var(--clr-3) {percentage}%, var(--clr-2) {percentage}%);"
	>
		<div class="thumb" bind:this={thumb} style="left: {percentage}%"></div>
	</div>
</div>

<style>
	.slider {
		width: 200px;
		height: 30px;
		position: relative;
		cursor: pointer;
		touch-action: none; /* Prevent default touch scrolling */
	}

	.track {
		position: absolute;
		top: 50%;
		left: 0;
		width: 100%;
		height: 8px;
		transform: translateY(-50%);
		border-radius: 4px;
		background-color: var(--clr-2);
	}

	.thumb {
		position: absolute;
		top: 50%;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background-color: var(--clr-4);
		transform: translate(-50%, -50%);
		z-index: 1;
		box-shadow: 1px 1px 1px var(--box-clr);
		transition: all 200ms ease-in-out;
	}

	.thumb:hover,
	.thumb:focus {
		transform: scale(1.25) translate(-50%, -50%);
		transform-origin: top left;
	}
</style>
