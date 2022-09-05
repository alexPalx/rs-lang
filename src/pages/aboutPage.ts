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
        completedTasks: ['Кастомный роутер', 'Регистрация', 'Авторизация', 'Страница статистики', 'Долгосрочная статистика', 'Страница о команде'],
      },
      {
        imageSrc: './assets/img/vitaliphoto.jpeg',
        name: 'Виталий Дреко',
        github: 'https://github.com/dokahp',
        position: 'Разработчик',
        completedTasks: ['Верстка UI', 'Электронный учебник', 'Список слов', 'Добавление cложных, изученных слов', 'Статистика по слову'],
      },
      {
        imageSrc: './assets/img/sergeiphoto.jpeg',
        name: 'Сергей Черняк',
        github: 'https://github.com/atcherdsd',
        position: 'Разработчик',
        completedTasks: ['Мини-игра Спринт', 'Мини-игра Аудиовызов', 'Взаимодействие игр со статистикой и учебником'],
      },
    ];

    devInfoList.forEach((dev: DevInfo) => new Developer(this.devList.node, dev));
  }
}
