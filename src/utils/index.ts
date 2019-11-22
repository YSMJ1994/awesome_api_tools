export function string2regexp(str: string) {
	return new RegExp(str.replace(/\\/g, '\\\\').replace(/([?{}.\[\],|()<!:^$*+])/g, '\\$1'));
}
