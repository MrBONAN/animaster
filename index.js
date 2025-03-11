addListeners();

function addListeners() {

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            const customAnimation = animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);
            customAnimation.play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000, {x: 100, y: 20});
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });

    let heartBeatingAnimation = null;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            if (heartBeatingAnimation !== null) {
                heartBeatingAnimation.stop();
            }
            heartBeatingAnimation = animaster().heartBeating(block, 1000);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (heartBeatingAnimation !== null) {
                heartBeatingAnimation.stop();
            }
        });

    document.getElementById('resetMoveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resetMoveAndScale(block);
            resetFadeOut(block);
        });


    const worryAnimationHandler = animaster()
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .buildHandler();

    document
        .getElementById('worryAnimationBlock')
        .addEventListener('click', worryAnimationHandler);

}

function animaster() {
    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeIn(element, duration) {
        return this.addFadeIn(duration).play(element)
    }

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeOut(element, duration) {
        return this.addFadeOut(duration).play(element);
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        return this.addMove(duration, translation).play(element);
    }

    /**
     * Функция, передвигающая элемент
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function addMove(duration, translation) {
        this._steps.push({name: 'move', duration: duration, args: translation});
        return this;
    }

    /**
     * Функция, передвигающая элемент
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — то, во сколько раз надо изменить размер
     */
    function addScale(duration, ratio) {
        this._steps.push({name: 'scale', duration: duration, args: ratio});
        return this;
    }

    function addFadeIn(duration) {
        this._steps.push({name: 'fadeIn', duration: duration, args: null});
        return this;
    }

    function addFadeOut(duration) {
        this._steps.push({name: 'fadeOut', duration: duration, args: null});
        return this;
    }

    function addDelay(duration) {
        this._steps.push({name: 'delay', duration: duration, args: null});
        return this;
    }

    function buildHandler() {
        const steps = this._steps;

        return function () {
            const element = this;
            animaster()._steps.push(...steps);
            animaster().play(element);
        };
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param cycled
     */
    function play(element, cycled = false) {
        let delay = 0;
        const initialTransform = element.style.transform;
        const initialClasses = [...element.classList];
        const animation = () => {
            for (const {name, duration, args} of this._steps) {
                setTimeout(() => {
                    switch (name) {
                        case 'move':
                            element.style.transitionDuration = `${duration}ms`;
                            element.style.transform = getTransform(args, null, element.style.transform);
                            break;
                        case 'scale':
                            element.style.transitionDuration = `${duration}ms`;
                            element.style.transform = getTransform(null, args, element.style.transform);
                            break;
                        case 'fadeIn':
                            element.style.transitionDuration = `${duration}ms`;
                            element.classList.remove('hide');
                            element.classList.add('show');
                            break;
                        case 'fadeOut':
                            element.style.transitionDuration = `${duration}ms`;
                            element.classList.remove('show');
                            element.classList.add('hide');
                            break;
                        case 'delay':
                            break;
                    }
                }, delay);

                delay += duration;
            }
        }

        animation();

        if (cycled) {
            const intervalId = setInterval(animation, delay);
            return {
                stop: () => {
                    clearInterval(intervalId);
                    this.reset(element, initialTransform, initialClasses);
                },
                reset: () => this.reset(element, initialTransform, initialClasses),
            };
        }

        return {
            stop: () => {
            },
            reset: () => this.reset(element, initialTransform, initialClasses),
        };
    }

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    function scale(element, duration, ratio) {
        this.addScale(duration, ratio).play(element);
    }

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function moveAndHide(element, duration, translation) {
        return this
            .addMove(duration * 2 / 5, translation)
            .addFadeOut(duration * 3 / 5)
            .play(element);
    }

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function showAndHide(element, duration) {
        return this
            .addFadeIn(duration / 3)
            .addDelay(duration / 3)
            .addFadeOut(duration / 3)
            .play(element);
    }

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function heartBeating(element, duration) {
        return this
            .addScale(duration / 2, 1.4)
            .addScale(duration / 2, 1)
            .play(element, true);
    }

    function stop() {
        this.cycled = false;
    }

    let obj = {
        _steps: [],
        cycled: true,
    }

    obj.fadeIn = fadeIn;
    obj.fadeOut = fadeOut;
    obj.move = move;
    obj.scale = scale;
    obj.moveAndHide = moveAndHide;
    obj.showAndHide = showAndHide;
    obj.heartBeating = heartBeating;

    obj.addMove = addMove;
    obj.addScale = addScale;
    obj.addFadeIn = addFadeIn;
    obj.addFadeOut = addFadeOut;
    obj.addDelay = addDelay;
    obj.buildHandler = buildHandler;

    obj.play = play;
    obj.stop = stop;

    return obj;
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо сбросить к заводским настройкам
 */
function resetFadeIn(element) {
    element.style.transitionDuration = null;
    element.classList.remove('show');
    element.classList.add('hide');
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо сбросить к заводским настройкам
 */
function resetFadeOut(element) {
    element.style.transitionDuration = null;
    element.classList.remove('hide');
    element.classList.add('show');
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо сбросить к заводским настройкам
 */
function resetMoveAndScale(element) {
    element.style.transitionDuration = null;
    element.style.transform = null;
}


function getTransform(translation, ratio, currentTransform) {
    let transform = currentTransform || '';
    if (translation) {
        transform += `translate(${translation.x}px,${translation.y}px)`;
    }
    if (ratio) {
        transform += `scale(${ratio})`;
    }
    return transform.trim();
}
