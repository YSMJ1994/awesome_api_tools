import { DocBaseConstructor } from '../model/DocBase';
import { ApiParameter } from './utils';
import { PartialPart } from '../common/types'

type ApiParamParameter = PartialPart<Omit<ApiParameter, 'parentKey'>, 'order' | 'description'>;

function ApiParam({ paramName, name, type, description = '' }: ApiParamParameter) {
	return function<T extends DocBaseConstructor>(target: T, propertyKey: PropertyKey, parameterIndex: number) {
		// 参数注解所在函数名称
		const fnName = String(propertyKey);
		const newParameter = {
			paramName,
			name,
			description,
			order: parameterIndex,
			type
		};
		// 向类中记录
		let parametersMap = target.__api_parameters__;
		if (!parametersMap) {
			parametersMap = {};
			target.__api_parameters__ = parametersMap;
		}
		let fnParamObj = parametersMap[fnName];
		if (!fnParamObj) {
			fnParamObj = {};
			parametersMap[fnName] = fnParamObj;
		}
		fnParamObj[paramName] = newParameter;
	};
}

export default ApiParam;
