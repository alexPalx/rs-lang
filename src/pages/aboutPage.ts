import { DevInfo } from '../interfaces/types';
import Component from '../common/component';
import Developer from './components/developer';

export default class AboutPage extends Component {
  public title: Component;
  public devList: Component<HTMLElement>;

  constructor(parentElement: HTMLElement) {
    super(parentElement, 'div', 'about-wrapper');
    this.title = new Component(this.node, 'h2', 'about-title', 'О команде');

    this.devList = new Component(this.node, 'ul', 'about-list');

    const devInfoList: DevInfo[] = [
      {
        imageSrc: '*devImage*',
        name: 'Алексей Палюхович',
        github: 'https://github.com/alexPalx',
        position: 'Разработчик',
        completedTasks: ['Таск 1', 'таск 2', 'таск 3', 'таск 4'],
      },
      {
        imageSrc: '*devImage*',
        name: 'Виталий Дреко',
        github: 'https://github.com/dokahp',
        position: 'Разработчик',
        completedTasks: ['Таск 1', 'таск 2', 'таск 3', 'таск 4'],
      },
      {
        imageSrc: '*devImage*',
        name: 'Сергей Черняк',
        github: 'https://github.com/atcherdsd',
        position: 'Разработчик',
        completedTasks: ['Таск 1', 'таск 2', 'таск 3', 'таск 4'],
      },
    ];

    devInfoList.forEach((dev: DevInfo) => new Developer(this.devList.node, dev));
  }
}
