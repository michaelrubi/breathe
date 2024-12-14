<!-- +page.svelte -->
<script lang="ts">
	import '$lib/app.css';
	import type { Option } from '$lib';
	import { blur } from 'svelte/transition';
	import Slider from '$lib/Slider.svelte';
	import Select from '$lib/Select.svelte';
	type Direction = 'inhale' | 'hold' | 'exhale' | null;
	type Mode =
		| 'Box Breathing'
		| 'Physiological Sigh'
		| '4-7-8 Breathing'
		| 'Coherent Breathing'
		| 'Alternate Nostril Breathing'
		| 'Ujjayi Breathing';
	type AppStates = 'menu' | 'running' | 'countdown' | 'results';
	let modes = [
		'Box Breathing',
		'Physiological Sigh',
		'4-7-8 Breathing',
		'Coherent Breathing',
		'Alternate Nostril Breathing',
		'Ujjayi Breathing'
	];
	let themes: Option[] = [
		{ label: 'Ocean Breeze', value: 'ocean-breeze' },
		{ label: 'Forest Calm', value: 'forest-calm' },
		{ label: 'Twilight Hues', value: 'twilight-hues' }
	];
	/*
    Box Breathing (Square Breathing)

    Rhythm: Equal duration for inhale, hold, exhale, hold (e.g., 4 seconds each).
    Benefits: Stress reduction, improved focus, emotional regulation, increased lung capacity.

2.  Physiological Sigh

    Rhythm: Double inhale (one shorter, one longer), extended exhale.
    Benefits: Rapidly reduces stress and anxiety, calms the nervous system.

3.  4-7-8 Breathing (Relaxing Breath)

    Rhythm: Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds.
    Benefits: Promotes relaxation, improves sleep, reduces anxiety.

4.  Coherent Breathing (Resonance Breathing)

    Rhythm: Inhale and exhale for about 5-6 seconds each (aim for 5.5 breaths per minute).
    Benefits: Increases HRV (heart rate variability), improves cardiovascular health, reduces stress.

5.  Alternate Nostril Breathing (Nadi Shodhana)

    Rhythm: Inhale through one nostril, exhale through the other, alternating nostrils.
    Benefits: Balances the nervous system, calms the mind, promotes relaxation.

6.  Ujjayi Breathing (Ocean Breath)

    Rhythm: Slightly constrict the back of the throat to create a soft "ha" sound on both the inhale and exhale.
    Benefits: Calming, warming, energizing, often used in yoga practices. 
    */

	let direction = $state<Direction>(null);
	let timer = $state(0);
	let round = $state(0);
	let appState = $state<AppStates>('menu');
	let isRunning = $derived(appState === 'running');

	let inputLength = $state(4);
	let inputRounds = $state(3);
	let timeRemaining = $state(0);
	let inputMode = $state<Mode>('Box Breathing');
	let inputTheme = $state('ocean-breeze');

	async function start(length: number = 4, rounds: number = 3) {
		timer = 0;
		appState = 'countdown';
		for (let i = 3; i > 0; i--) {
			timer = i;
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
		appState = 'running';
		timeRemaining = length * rounds * 4;
		for (let i = 0; i < rounds * 4; i++) {
			if (!isRunning) return;
			let newDirection: Direction = null;
			switch (i % 4) {
				case 0:
					newDirection = 'inhale';
					round++;
					break;
				case 2:
					newDirection = 'exhale';
					break;
				default:
					newDirection = 'hold';
					break;
			}
			direction = newDirection;
			timer = 0;
			for (let j = length; j > 0; j--) {
				timer = j;
				timeRemaining--;
				await new Promise((resolve) => setTimeout(resolve, 1000));
				if (!isRunning) return;
			}
		}
		direction = null;
		round = 0;
		timeRemaining = 0;
		appState = 'menu';
	}

	function reset() {
		direction = null;
		round = 0;
		timeRemaining = 0;
		appState = 'menu';
	}
</script>

{#if appState === 'menu'}
	<div class="menu">
		<h1>Box Breathing</h1>
		<Select options={themes} bind:value={inputTheme}></Select>
		<!-- <select name="mode" id="mode" bind:value={inputMode}>
			{#each modes as mode}
				<option value={mode}>{mode}</option>
			{/each}
		</select> -->
		<div>
			<h4>{inputLength} Second Breath</h4>
			<Slider bind:value={inputLength} min={3} max={10} step={1} />
		</div>
		<div>
			<h4>{inputRounds} Rounds</h4>
			<Slider bind:value={inputRounds} min={2} max={10} step={1} />
		</div>
		<h5>Total Time: {inputLength * inputRounds * 4} seconds</h5>
		<button onclick={() => start(inputLength, inputRounds)}>Start</button>
	</div>
{:else if appState === 'countdown'}
	<div class={inputTheme + ' running'}>
		<h2>Get Ready to Inhale</h2>
		<div class="timer">
			{#key timer}
				<h1>{timer}</h1>
			{/key}
		</div>
	</div>
{:else}
	<div class={inputTheme + ' running'}>
		<div class="direction">
			{#key direction}
				<h2 transition:blur>{direction}</h2>
			{/key}
		</div>
		<div class="timer">
			{#key timer}
				<h1>{timer}</h1>
			{/key}
		</div>
		<h3>Round: {round} / {inputRounds}</h3>
		<h4>Time Remaining: {timeRemaining} seconds</h4>
		<button onclick={() => reset()}>Stop</button>
	</div>
{/if}
