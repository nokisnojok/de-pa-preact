export { render, hydrate } from './render';
export {
	createElement,
	createElement as h,
	Fragment,
	InjectionProvider,
	createRef,
	isValidElement
} from './create-element';
export { Component } from './component';
export { cloneElement } from './clone-element';
export { createContext } from './create-context';
export { toChildArray } from './diff/children';
export { IComponent, Props, Context, Parent } from './injector/decorators';
export { default as options } from './options';
