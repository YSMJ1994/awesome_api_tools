import { DocBaseConstructor } from '../model/DocBase';

function ApiModule(name: string, order: number = 0, author: string = '无名人士') {
	return function<T extends DocBaseConstructor>(target: T) {
		// 将模块信息记录在目标class上
		target.__api_modules__ = { className: target.name, name, order, author };
	};
}

export default ApiModule;
