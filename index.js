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
            animaster().fadeOut(block, 5000);
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
            heartBeatingAnimation.stop();
        });


    document.getElementById('resetMoveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resetMoveAndScale(block);
            resetFadeOut(block)
        });
}

function animaster() {
    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeIn(element, duration) {
        this.addFadeIn(duration).play(element)
    }

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeOut(element, duration) {
        this.addFadeOut(duration).play(element);
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        this.addMove(duration, translation).play(element);
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

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     */
    function play(element) {
        for (const {name, duration, args} of this._steps) {
            switch (name) {
                case 'move':
                    element.style.transitionDuration = `${duration}ms`;
                    element.style.transform = getTransform(args, null);
                    break;
                case 'scale':
                    element.style.transitionDuration = `${duration}ms`;
                    element.style.transform = getTransform(null, args);
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
            }
        }
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
        this.move(element, duration * 2 / 5, translation);
        this.fadeOut(element, duration * 3 / 5);
    }

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function showAndHide(element, duration) {
        this.fadeIn(element, duration / 3);
        setTimeout(() => this.fadeOut(element, duration / 3), 1000 / 3);
    }

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function heartBeating(element, duration) {
        element.style.transitionDuration = `${duration / 2}ms`;
        setInterval(() => {
            if (this.cycled !== true) {
                return
            }

            element.style.transform = getTransform(null, 1.4);
            setTimeout(() => element.style.transform = getTransform(null, 1), duration / 2);
        }, duration);

        return this;
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


function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
