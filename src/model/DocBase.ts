import {
	ApiModule,
	ApiInterface,
	ApiParameter,
	getInterfaceKey,
	getModuleKey,
	getParameterKey
} from '../annotation/utils';
import { FN, CustomObject } from '../common/types'

export type InterfaceItem = ApiInterface & {
	id: string;
	parameters: ParameterItem[];
};

export type ParameterItem = ApiParameter & {
	id: string
}

export type DocJSON = ApiModule & {
	id: string;
	interfaces: InterfaceItem[];
};

export type Interface = Omit<ApiInterface, 'parentKey'>;

export type Parameter = Omit<ApiParameter, 'parentKey'>;

export interface MockConfig {
	url: string | RegExp;
	method: string;
	getTemplate?: FN<[any?], any>;
	template?: any;
}

export declare class DocBaseType {
	static __api_modules__: ApiModule;
	static __api_interfaces__: CustomObject<Interface>;
	static __api_parameters__: CustomObject<CustomObject<Parameter>>;
	static __api_mocks__: MockConfig[];
	static toDocJSON(): DocJSON;
	static logCache(): void;
}

export type DocBaseConstructor = typeof DocBase;

class DocBase implements DocBaseType {
	static __api_modules__: ApiModule;
	static __api_interfaces__: CustomObject<Interface>;
	static __api_parameters__: CustomObject<CustomObject<Parameter>>;
	static __api_mocks__: MockConfig[];
	static toDocJSON() {
		const apiModule = this.__api_modules__;
		const apiInterfaces = this.__api_interfaces__ || {};
		const apiParameters = this.__api_parameters__ || {};
		if (!apiModule) {
			throw new Error(`api模块必须添加[ @ApiModule ]注解`);
		}
		const { className, name, order, author } = apiModule;
		const moduleKey = getModuleKey(className, name);
		return {
			id: moduleKey,
			className,
			name,
			order,
			author,
			interfaces: Object.keys(apiInterfaces)
				.sort((k1, k2) => apiInterfaces[k1].order - apiInterfaces[k2].order)
				.reduce<Array<InterfaceItem>>((pre, k) => {
					if (!this.hasOwnProperty(k)) {
						return pre;
					}
					let { fnName, name, description, order, result, author } = apiInterfaces[k] || '';
					const interfaceKey = getInterfaceKey(moduleKey, fnName);
					const parameters = Object.keys(apiParameters[fnName] || {})
						.map(k => ({
							...apiParameters[fnName][k],
							parentKey: interfaceKey,
							id: getParameterKey(interfaceKey, apiParameters[fnName][k].paramName)
						}))
						.sort((p1, p2) => p1.order - p2.order);
					pre.push({
						id: interfaceKey,
						fnName,
						name,
						description,
						order,
						result,
						parentKey: moduleKey,
						parameters,
						author
					});
					return pre;
				}, [])
		};
	}
	static logCache() {
		console.log('module info', this.__api_modules__);
		console.log('interfaces info', this.__api_interfaces__);
		console.log('parameters info', this.__api_parameters__);
	}
}

export default DocBase;
