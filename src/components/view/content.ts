import Control from '../../utils/control';

export default class Content extends Control {
  constructor() {
    const contentWrapper = document.getElementById('main');
    super(contentWrapper, 'div', 'content');
    }
    
    public setContent(content: string) {
        this.node.innerHTML = content;
    }
}
