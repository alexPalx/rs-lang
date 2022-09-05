export default class Component<T extends HTMLElement = HTMLElement> {
    public node: T;

    constructor(parentNode: HTMLElement | null, tagName = 'div', className = '', content = '') {
        const element = document.createElement(tagName);
        element.className = className;
        element.textContent = content;
        parentNode?.append(element);
        this.node = <T>element;
    }

    public destroy(): void {
        this.node.remove();
    }
}
