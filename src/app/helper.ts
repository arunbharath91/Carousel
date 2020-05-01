class DomElement {
  private elements: any[] | NodeListOf<HTMLElement>; //The actual DOM element
  constructor(selector: string) {
    if (selector === 'document') {
      this.elements = [document];
    } else if (selector === 'window') {
      this.elements = [window];
    } else {
      this.elements = (selector.length) ? Array.prototype.slice.call(document.querySelectorAll(selector)) : new Array(selector);
    }
  }

  each(callback: Function, fncallback?: Function) {
    if (!callback || typeof callback !== 'function') return;
    for (let i in this.elements) {
      callback(this.elements[i], i);
    }
    if (typeof fncallback === 'function') fncallback();
    return this;
  };
  addClass(className: string) {
    const classList = className.split(' ');
    this.each((item: HTMLElement) => {
      item.classList.add(...classList);
    });
    return this;
  }
  removeClass(className: string) {
    const classList = className.split(' ');
    this.each((item: HTMLElement) => {
      item.classList.remove(...classList);
    });
    return this;
  };
  siblings() {

    let siblings: ChildNode[] = [];
    this.each((item: HTMLElement) => {
      let sibling = item.parentNode ?.firstChild;
      for (; sibling; sibling = sibling.nextSibling) {
        if (sibling.nodeType !== 1 || sibling === item) continue;
        siblings.push(sibling);
      }
    });
    this.elements = siblings;
    return this;
  }
}

export const _s = (selector: any) => {
  const el = new DomElement(selector);
  return el;
}
