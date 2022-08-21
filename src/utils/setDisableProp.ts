export const setDisable = (elem: HTMLElement) => {
  elem.setAttribute('disabled', 'true');
};

export const removeDisable = (elem: HTMLElement) => {
  elem.removeAttribute('disabled');
};
