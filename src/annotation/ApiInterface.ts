import { DocBaseConstructor } from '../model/DocBase';

interface ApiInterfaceParameters {
	name: string;
	description?: string;
	order?: number;
	result?: string;
	author?: string
}

function ApiInterface({ name, description = '', order = 0, result = '无', author = '无名人士' }: ApiInterfaceParameters) {
	return function<T extends DocBaseConstructor>(target: T, propertyKey: PropertyKey, descriptor: PropertyDescriptor) {
		const fnName = String(propertyKey);
		// 向缓存注册
		const newInterface = {
			fnName,
			name,
			description,
			order,
			result,
			author
		};
		// 向类中注册
		let interfaceMap = target.__api_interfaces__;
		if (!interfaceMap) {
			interfaceMap = {};
			target.__api_interfaces__ = interfaceMap;
		}
		interfaceMap[fnName] = newInterface;
	};
}

export default ApiInterface;
