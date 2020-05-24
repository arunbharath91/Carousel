import { _s } from "./helper";

interface IOptions {
  interval?: number;
  autoplay?: boolean;
  nav?: boolean;
  dots?: boolean;
}

const defaultOptions: IOptions = {
  interval: 3000,
  autoplay: false,
  nav: true,
  dots: true
}

export class Carousel {
  private selector!: HTMLElement;
  private carouselContainer!: HTMLElement;
  private carouselItems!: HTMLElement[];
  private containerWidth!: number;
  private totalItems!: number;
  private jumpSlideWidth!: number;
  private options!: IOptions;
  private index!: number;
  private play: any[] = [];
  private sliderPagination!: HTMLElement;
  constructor(selector: string, options?: IOptions) {
    this.options = { ...defaultOptions, ...options }
    this.config(selector);
    window.addEventListener('resize', () => {
      this.config(selector)
    });
  }


  protected config(selector: string) {
    this.selector = (document.querySelector(selector) as HTMLElement);
    this.carouselContainer = (this.selector.querySelector(".carousel-container") as HTMLElement);
    this.carouselContainer.style.width = `${this.selector.clientWidth}px`;
    this.containerWidth = this.carouselContainer.offsetWidth;
    this.totalItems = 0;
    this.jumpSlideWidth = 0;
    this.index = 0;
    this.carouselContainer.style.marginLeft = '0';
    this.carouselItems = Array.prototype.slice.call(this.carouselContainer.children);
    this.initSlider();
  }


  protected initSlider() {
    let totalItemsWidth: number = 0;
    Array.from(this.carouselItems).forEach((carousel) => {
      (carousel as HTMLElement).style.width = `${this.containerWidth}px`;
      totalItemsWidth += this.carouselContainer.offsetWidth;
      this.totalItems++;
    });
    this.carouselContainer.style.width = `${totalItemsWidth}px`;
    this.insertControls();
  }

  private insertControls() {
    if (this.options.nav) this.generateNav();
    if (this.options.dots) this.generateLi();
    if (this.options.autoplay) {
      this.autoplay();
      this.selector.addEventListener('mouseover', () => {
        this.destroyPlay(this.play);
      });
      this.selector.addEventListener('mouseout', () => {
        this.destroyPlay(this.play);
        this.autoplay();
      });
    }
  }

  private autoplay() {
    if (this.play.length > 0) {
      this.destroyPlay(this.play);
      this.play.pop();
    }
    this.play.push(setInterval(() => {
      this.next();
    }, this.options.interval));
  }

  private destroyPlay(play: any) {
    play.forEach((p: any) => {
      clearInterval(p);
    });
  }

  private generateNav() {
    const presence = document.querySelector("slider-nav.sliderNav");
    if (presence) {
      presence.remove();
    }
    const slideNav = document.createElement('slider-nav');
    slideNav.className = 'sliderNav'
    slideNav.style.zIndex = '1000';
    slideNav.innerHTML = `<a class="control_prev">	&#8592; </a>
    <a class="control_next">&#8594; </a>`;
    this.selector.appendChild(slideNav);
    (slideNav.querySelector('.control_prev') as HTMLElement).addEventListener('click', () => this.prev());
    (slideNav.querySelector('.control_next') as HTMLElement).addEventListener('click', () => this.next());
  }

  // next slide method
  private next() {
    if (this.index == this.totalItems - 1) {
      this.index = 0;
      this.jumpSlideWidth = 0;
    }
    else {
      this.index++;
      this.jumpSlideWidth = this.jumpSlideWidth + this.containerWidth;
    }
    this.activateCurrentPagination(`ul.sliderCtrl li:nth-child(${this.index + 1})`);
    this.carouselContainer.style.marginLeft = - this.jumpSlideWidth + "px"
  }

  // prev slide method
  private prev() {
    if (this.index == 0) {
      this.index = this.totalItems - 1;
      this.jumpSlideWidth = this.containerWidth * (this.totalItems - 1);
    }
    else {
      this.index--;
      this.jumpSlideWidth = this.jumpSlideWidth - this.containerWidth;
    }
    this.activateCurrentPagination(`ul.sliderCtrl li:nth-child(${this.index + 1})`);
    this.carouselContainer.style.marginLeft = - this.jumpSlideWidth + "px"
  }

  protected generateLi() {
    const presence = document.querySelector("ul.sliderCtrl");
    if (presence) {
      presence.remove();
    }
    this.sliderPagination = document.createElement("ul");
    this.sliderPagination.className = 'sliderCtrl';
    for (let i = 1; i <= this.totalItems; i++) {
      const li = document.createElement("li");
      li.id = i.toString();
      li.addEventListener("click", (e) => {
        this.activateCurrentPagination(e.target);
        this.controlSlides(+(e.target as HTMLElement).id - 1);
      });
      this.sliderPagination.appendChild(li);
      if (i == 1) {
        li.className = "active";
      }
    }
    this.selector.appendChild(this.sliderPagination);
  }

  private activateCurrentPagination(target: any) {
    _s(target).addClass('active').siblings().removeClass('active');
  }

  protected controlSlides(num: number) {
    this.destroyPlay(this.play);
    this.play.pop();
    this.index = num;
    this.jumpSlideWidth = (this.containerWidth * num);
    this.carouselContainer.style.marginLeft = - this.jumpSlideWidth + "px";
  }

}
