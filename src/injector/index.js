import { ReflectiveInjector } from 'injection-js';
import { InjectionProvider } from '../create-element';

function getParent(vNode) {
	return vNode._parent;
}

function findInjectionProviderVNode(vNode) {
	let p = getParent(vNode);
	while (p) {
		if (p.type === InjectionProvider) {
			return p;
		}
		p = getParent(p);
	}
	return null;
}

function findParentVNode(vNode) {
	let p = getParent(vNode);
	while (p) {
		if (p.isClassComponent) {
			return p;
		}
		p = getParent(p);
	}
	return null;
}

export function createInjectorProvider(vNode) {
	const providers = vNode.props.providers || [];
	const pInjectorProvider = findInjectionProviderVNode(vNode);
	const pInjector = pInjectorProvider ? pInjectorProvider.injector : undefined;
	return createInjector(providers, pInjector);
}

export function createInjector(provides, parentInjector) {
	return ReflectiveInjector.resolveAndCreate(
		provides,
		parentInjector || undefined
	);
}

export function instantiate(ctor, props, context, vNode) {
	const pVNode = findParentVNode(vNode);
	const injectionProviderFiber = findInjectionProviderVNode(vNode);
	const pInjector = injectionProviderFiber && injectionProviderFiber.injector;
	const paramAnnotations = Reflect.getMetadata('design:paramtypes', ctor);
	const paramTypes = Reflect.getMetadata('parameters', ctor);
	const notDecoratorMetadata = !paramAnnotations && !paramTypes;
	const injector = createInjector(
		[
			notDecoratorMetadata
				? {
						provide: ctor,
						useFactory(props, context, updater) {
							return new ctor(props, context, updater);
						},
						deps: ['props', 'context', 'updater']
				  }
				: ctor,
			{
				provide: 'props',
				useValue: props
			},
			{
				provide: 'context',
				useValue: context
			},
			{
				provide: 'updater',
				useValue: null
			},
			{
				provide: 'parent',
				useValue: pVNode ? pVNode._component : null
			}
		],
		pInjector
	);

	vNode.injector = injector;

	return injector.get(ctor);
}
