// const util = require('./swiperUtil')
import util from './swiperUtil';
// paginations: paginations的选择器
// autoPlay: 自动播放的间隔
// animationDuration: 动画播放的时间
// paginationActive: 活跃pagination的类
// swiperEvent: swiper的事件
class Swiper {
    constructor(selector, opts) {
        this.opts = Object.assign({}, opts);
        this.container = document.querySelector(selector);
        this.sliderWrap = document.querySelector('.swiper-wrapper');
        this.sliders = Array.from(this.sliderWrap.querySelectorAll('.swiper-slider'));
        this.slidersLength = this.sliders.length;

        this.autoPlay = opts.autoPlay;
        this.animationDuration = opts.animationDuration;
        this.swiperEvent = opts.swiperEvent || 'click';

        this.pageIndex = 0;
        this.sliderIndex = opts.sliderIndex || 0;

        this.isCanStep = true;

        this.initSliders();
        this.initEvents();
        if (opts.paginations) {
            this.paginationsWrap = this.container.querySelector(opts.paginations);
            this.paginations = Array.from(this.paginationsWrap.querySelectorAll('.cursor'));
        }
        if (opts.pre && opts.next) {
            this.nextButton = this.container.querySelector(opts.next);
            this.preButton = this.container.querySelector(opts.pre);
        }
        this.initPaginationEvents();
        this.initStep();
    }

    initEvents() {
        this.sliderWrap.addEventListener('mouseenter', this.stopAutoPlay);
        this.sliderWrap.addEventListener('mouseleave', this.startAutoPlay);
        this.play();
    }

    initPaginationEvents() {
    // this.paginations && this.paginations.forEach((pagination, index) => {
    //   pagination.addEventListener(this.swiperEvent, () => {
    //     this.step(index)
    //   })
    // })

        this.nextButton && this.nextButton.addEventListener('click', this.next);
        this.preButton && this.preButton.addEventListener('click', this.pre);
    }

    initStep = () => {
        const nextSliderIndex = this._normalizeIndex(this.sliderIndex, this.slidersLength);
        this.nextSliderIndex = nextSliderIndex;
        setTimeout(this.animate.bind(this), 0);
    }

    destoryEvents = () => {
        this.sliderWrap.removeEventListener('mouseenter', this.stopAutoPlay);
        this.sliderWrap.removeEventListener('mouseleave', this.startAutoPlay);
        this.nextButton && this.nextButton.removeEventListener('click', this.next);
        this.preButton && this.preButton.removeEventListener('click', this.pre);
        util.emitter.off('sliderIndexChange');
    }

    startAutoPlay = () => {
        this.autoPlay = this.opts.autoPlay;
        this.play();
    }

    stopAutoPlay = () => {
        clearTimeout(this.playID);
        this.autoPlay = 0;
    }

    beforePlay() {
        this.beforeDate = new Date();
    }

    endPlay() {
        this.endDate = new Date();
    // ''
    }

    play() {
        this.beforePlay();
        if (this.autoPlay) {
            this.playID = setTimeout(this.next.bind(this), this.autoPlay);
        }
    }

    initSliders() {
        this.sliders.forEach((slider, index) => {
            if (index !== this.sliderIndex) {
                slider.style.display = 'none';
            }
        });
    }

    pre = () => {
        const stepIndex = this.sliderIndex - 1;
        this.step(stepIndex);
    }

    next = () => {
        const stepIndex = this.sliderIndex + 1;
        this.step(stepIndex);
    }

    step = (index) => {
        this.stopAutoPlay();
        const nextSliderIndex = this._normalizeIndex(index, this.slidersLength);
        if (!this.isCanStep || this.sliderIndex === nextSliderIndex) return;
        this.nextSliderIndex = nextSliderIndex;
        setTimeout(this.animate.bind(this), 0);
    // this.animate()
    }

    animate() {
        if (this.sliderIndex === null || this.nextSliderIndex === null) return;
        const animationDuration = this.animationDuration;
        const currentSlider = this.sliders[this.sliderIndex];
        const nextSlider = this.sliders[this.nextSliderIndex];
        this.isCanStep = false;
        if (currentSlider) {
            currentSlider.style.display = 'none';
        }
        util.emitter.emit('sliderIndexChange', this.nextSliderIndex);
        util.animate(
            nextSlider,
            'opacity',
            0.8,
            1,
            animationDuration,
            () => {
                nextSlider.style.display = 'block';
            },
            () => {
                this.isCanStep = true;
                this.sliderIndex = this.nextSliderIndex;
                this.nextSliderIndex = null;
                if (this.autoPlay) {
                    this.endPlay();
                    this.play();
                }
            }
        );
    }

    _normalizeIndex(index, len) {
        return (index + len) % len;
    }
}

export default Swiper;
