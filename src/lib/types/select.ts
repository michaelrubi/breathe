import { type HTMLButtonAttributes } from 'svelte/elements';

export type Option = {
	label: string;
	value: string;
};

export interface SelectProps extends HTMLButtonAttributes {
	options: Option[];
	value: string;
}
