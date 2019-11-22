import DataType from '../common/DataType';
import { CustomObject } from '../common/types'

export interface ApiModule {
	className: string;
	name: string;
	order: number;
	author: string;
}

export interface ApiInterface {
	fnName: string;
	name: string;
	description: string;
	order: number;
	result: string;
	parentKey: string;
	author: string;
}

export interface ApiParameter {
	paramName: string;
	name: string;
	description: string;
	type: DataType | Object;
	order: number;
	parentKey: string;
}

type Store = {
	modules: CustomObject<ApiModule>;
	interfaces: CustomObject<ApiInterface>;
	parameters: CustomObject<ApiParameter>;
};

export function getModuleKey(className: string, name: string) {
	return `module_${className}_${name}`;
}

export function getInterfaceKey(moduleKey: string, fnName: string) {
	return `${moduleKey}_interface_${fnName}`;
}

export function getParameterKey(interfaceKey: string, paramName: string) {
	return `${interfaceKey}_parameter_${paramName}`;
}

class Utils {
	private store: Store = {
		modules: {},
		interfaces: {},
		parameters: {}
	};

	addModule(newApiModule: ApiModule) {
		const { className } = newApiModule;
		const key = getModuleKey(className, name);
		this.store.modules[key] = newApiModule;
	}

	addInterface(moduleKey: string, { fnName, name, order, description, result, author }: Omit<ApiInterface, 'parentKey'>) {
		const key = getInterfaceKey(moduleKey, fnName);
		this.store.interfaces[key] = {
			fnName,
			name,
			order,
			description,
			result,
			parentKey: key,
			author
		};
	}

	addParameter(interfaceKey: string, { paramName, name, order, description, type }: Omit<ApiParameter, 'parentKey'>) {
		const key = getParameterKey(interfaceKey, paramName);
		this.store.parameters[key] = {
			paramName,
			name,
			order,
			description,
			type,
			parentKey: key
		};
	}
}

export default new Utils();
