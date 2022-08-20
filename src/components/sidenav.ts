export const openNav = () => {
  (<HTMLElement>document.getElementById('sidenav')).style.width = '250px';
  (<HTMLElement>document.getElementById('main')).style.marginLeft = '250px';
  (<HTMLElement>document.querySelector('.header')).style.marginLeft = '250px';
  (<HTMLElement>document.querySelector('.footer')).style.marginLeft = '250px';
};

export const closeNav = () => {
  (<HTMLElement>document.getElementById('sidenav')).style.width = '0';
  (<HTMLElement>document.getElementById('main')).style.marginLeft = '0';
  (<HTMLElement>document.querySelector('.header')).style.marginLeft = '0';
  (<HTMLElement>document.querySelector('.footer')).style.marginLeft = '0';
};
