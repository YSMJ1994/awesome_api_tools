import { DocBaseConstructor } from '../model/DocBase';
import Mock from 'mockjs';
import { MockConfig } from '../model/DocBase';
import { string2regexp } from '../utils';
import { PartialPart } from '../common/types'

interface MockRequestOption {
	url: string;
	type: string;
	body: any;
}

type ApiMockConfig = PartialPart<MockConfig, 'method'>;

function resolveUrlRepeatSplit(url: string) {
	const httpReg = /^((?:https?:)?\/\/)?(.+)$/;
	const [, prefix = '', content = ''] = url.match(httpReg) || [];
	return prefix + content.replace(/\/\//g, '/');
}

function ApiMock(mockConfig: ApiMockConfig, enable: boolean = true) {
	return function<T extends DocBaseConstructor>(target: T, propertyKey: PropertyKey, descriptor: PropertyDescriptor) {
		if (enable) {
			const { url, method = 'GET', getTemplate, template } = mockConfig;
			const matchUrl = url instanceof RegExp ? url : string2regexp(resolveUrlRepeatSplit(url));
			Mock.mock(matchUrl, method, function({ url, type, body }: MockRequestOption) {
				function resolveTemplate(body: any) {
					if (!getTemplate) {
						return template;
					} else {
						if (typeof body === 'undefined') {
							return getTemplate();
						} else {
							try {
								let parseBody = body;
								// json对象格式的字符串则尝试parse一下
								if (typeof body === 'string' && /[{\[]/.test(body)) {
									parseBody = JSON.parse(body);
								}
								return getTemplate(parseBody);
							} catch (e) {
								return getTemplate(body);
							}
						}
					}
				}

				if (/^get$/i.test(type) || typeof body === 'undefined') {
					if (getTemplate) {
						return getTemplate(url);
					}
					if (template) {
						return template;
					}
				} else {
					return resolveTemplate(body);
				}
				return template;
			});

			// 向类中注册Mock配置
			let mocks = target.__api_mocks__;
			if (!mocks) {
				mocks = [];
				target.__api_mocks__ = mocks;
			}
			mocks.push({
				url,
				method,
				getTemplate,
				template
			});
		}
	};
}

export default ApiMock;
