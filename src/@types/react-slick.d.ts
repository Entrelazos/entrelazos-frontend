declare module 'react-slick' {
  import { Component } from 'react';

  export interface Settings {
    accessibility?: boolean;
    adaptiveHeight?: boolean;
    afterChange?: (index: number) => void;
    appendDots?: (dots: React.ReactNode) => JSX.Element;
    arrows?: boolean;
    asNavFor?: any;
    autoplay?: boolean;
    autoplaySpeed?: number;
    beforeChange?: (current: number, next: number) => void;
    centerMode?: boolean;
    centerPadding?: string;
    className?: string;
    cssEase?: string;
    customPaging?: (index: number) => JSX.Element;
    dots?: boolean;
    dotsClass?: string;
    draggable?: boolean;
    easing?: string;
    edgeFriction?: number;
    fade?: boolean;
    focusOnSelect?: boolean;
    infinite?: boolean;
    initialSlide?: number;
    lazyLoad?: 'ondemand' | 'progressive';
    nextArrow?: JSX.Element;
    pauseOnDotsHover?: boolean;
    pauseOnFocus?: boolean;
    pauseOnHover?: boolean;
    prevArrow?: JSX.Element;
    responsive?: Array<{
      breakpoint: number;
      settings: Partial<Settings>;
    }>;
    rows?: number;
    rtl?: boolean;
    slide?: string;
    slidesToScroll?: number;
    slidesToShow?: number;
    speed?: number;
    swipe?: boolean;
    swipeToSlide?: boolean;
    touchMove?: boolean;
    touchThreshold?: number;
    useCSS?: boolean;
    useTransform?: boolean;
    variableWidth?: boolean;
    vertical?: boolean;
    waitForAnimate?: boolean;
  }

  export interface SliderProps extends Settings {
    children?: React.ReactNode;
  }

  export default class Slider extends Component<SliderProps> {
    slickNext(): void;
    slickPrev(): void;
    slickGoTo(slide: number, dontAnimate?: boolean): void;
    slickPlay(): void;
    slickPause(): void;
  }
}