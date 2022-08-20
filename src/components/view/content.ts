import Control from '../../utils/control';

export default class Content extends Control {
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', 'content');
    }
    
    public setContent(content: string) {
        this.node.innerHTML = content;
    }
}
