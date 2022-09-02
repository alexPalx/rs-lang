export const openNav = () => {
  let width = 250;
  if (window.screen.width < 475) {
    width = window.screen.width;
    (<HTMLElement>document.getElementById('sidenav')).style.width = `${width}px`;
  } else {
    (<HTMLElement>document.getElementById('sidenav')).style.width = `${width}px`;
    (<HTMLElement>document.getElementById('main')).style.marginLeft = `${width}px`;
    (<HTMLElement>document.querySelector('.header')).style.marginLeft = `${width}px`;
    (<HTMLElement>document.querySelector('.footer')).style.marginLeft = `${width}px`;
  }
};

export const closeNav = () => {
  (<HTMLElement>document.getElementById('sidenav')).style.width = '0';
  (<HTMLElement>document.getElementById('main')).style.marginLeft = '0';
  (<HTMLElement>document.querySelector('.header')).style.marginLeft = '0';
  (<HTMLElement>document.querySelector('.footer')).style.marginLeft = '0';
};
