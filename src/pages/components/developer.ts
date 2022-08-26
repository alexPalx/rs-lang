import Component from '../../common/component';
import { DevInfo } from '../../interfaces/types';

export default class Developer extends Component {
  public image: Component<HTMLImageElement>;
  public name: Component<HTMLElement>;
  public githubBlock: Component<HTMLElement>;
  public githubImage: Component<HTMLImageElement>;
  public githubLink: Component<HTMLAnchorElement>;
  public position: Component<HTMLElement>;
  public taskList: Component<HTMLElement>;

  constructor(parentElement: HTMLElement, devInfo: DevInfo) {
    super(parentElement, 'div', 'dev-wrapper');

    this.image = new Component(this.node, 'img', 'dev-image');
    this.image.node.src = devInfo.imageSrc;
    this.image.node.alt = 'developer image';

    this.name = new Component(this.node, 'h3', 'dev-name', devInfo.name);

    this.githubBlock = new Component(this.node, 'div', 'dev-github-block');
    this.githubImage = new Component(this.githubBlock.node, 'img', 'dev-github-image');
    this.githubImage.node.src = ''; // TODO: add github image
    this.githubImage.node.alt = '';
    this.githubLink = new Component(
      this.githubBlock.node,
      'a',
      'dev-github-link',
      devInfo.github.slice(devInfo.github.lastIndexOf('/') + 1)
    );
    this.githubLink.node.href = devInfo.github;
    this.githubLink.node.target = '_blank';

    this.position = new Component(this.node, 'p', 'dev-position', devInfo.position);

    this.taskList = new Component(this.node, 'ol', 'dev-task-list');
    devInfo.completedTasks.forEach((task) => new Component(this.taskList.node, 'li', '', task));
  }
}
