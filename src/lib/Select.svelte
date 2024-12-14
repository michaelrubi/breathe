<!-- src/lib/Select.svelte -->
<script lang="ts">
	import type { SelectProps as Props, Option } from '$lib';

	let { options, value = $bindable() }: Props = $props();

	let isOpen = $state(false);
	let selectedOption = $state<Option | null>(null);

	function toggleOpen() {
		isOpen = !isOpen;
	}

	function selectOption(option: Option) {
		selectedOption = option;
		value = option.value;
		isOpen = false;
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
{#snippet listOption(option: Option)}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<li onclick={() => selectOption(option)} class:value={option.value === value}>
		{option.label}
	</li>
{/snippet}

{#snippet selectList(options: Option[])}
	<ul class="options">
		{#each options as option}
			{@render listOption(option)}
		{/each}
	</ul>
{/snippet}

<div class={'custom-select ' + value} class:open={isOpen}>
	<button onclick={toggleOpen}>
		<span>{selectedOption ? selectedOption?.label : 'Choose A Theme'}</span>
		<span class="arrow"></span>
	</button>
	{#if isOpen}
		{@render selectList(options)}
	{/if}
</div>

<style>
	.custom-select {
		position: relative;
		display: inline-block;
	}

	.arrow {
		display: inline-block;
		width: 0;
		height: 0;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-top: 5px solid var(--txt-sec);
		margin-left: 0.5rem;
		transition: transform 0.3s ease;
	}

	.custom-select.open .arrow {
		transform: rotate(180deg) translateY(1px);
	}

	.options {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		width: 100%;
		background-color: var(--clr-1);
		border-radius: 5px;
		padding: 0.5rem 0;
		margin: 0;
		list-style: none;
		z-index: 1;
		box-shadow: 0 2px 4px var(--box-clr);
		max-height: 200px;
		overflow-y: auto;
	}

	button {
		background-color: var(--clr-2);

		:hover {
			background-color: var(--clr-2);
		}
	}

	.options li {
		padding: 0.5rem 1rem;
		cursor: pointer;
	}

	.options li:hover {
		background-color: var(--clr-3);
	}

	.options li.value {
		background-color: var(--clr-4);
	}
</style>
