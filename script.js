(function () {
//    карточки
    var cards = [
        {
            id: 1,
            name: 'Prague',
            img: 'https://www.10mest.com/photos/czech-republic-prague-old-town-and-vltava-river-1280x720.jpg',
        },
        {
            id: 2,
            name: 'Paris',
            img: 'https://www.10mest.com/photos/france-paris-eiffel-tower-and-trocadero-gardens-1280x720.jpg',
        },
        {
            id: 3,
            name: 'Barcelona',
            img: 'https://espanarusa.com/files/autoupload/94/84/67/xllspuz5392644.jpg',
        },
        {
            id: 4,
            name: 'Rome',
            img: 'https://planetofhotels.com/guide/sites/default/files/styles/paragraph__live_banner__lb_image__1880bp/public/live_banner/rome_0.jpg',
        },
        {
            id: 5,
            name: 'Lisbon',
            img: 'https://tripplanet.ru/wp-content/uploads/europe/portugal/lisbon/dostoprimechatelnosti-lissabona.jpg',
        },
        {
            id: 6,
            name: 'Copenhagen',
            img: 'https://thumb.tildacdn.com/tild3535-6138-4436-b865-313839393265/-/resize/824x/-/format/webp/copenhagen-68510-597.jpg',
        },
        {
            id: 7,
            name: 'Vena',
            img: 'https://cms.enjourney.ru/upload/Jana/Osterreich/Vienna%20city/Vienna25.jpg',
        },
        {
            id: 8,
            name: 'Munich',
            img: 'https://d-russia.ru/wp-content/uploads/2020/05/munhen.jpg',
        },
        {
            id: 9,
            name: 'Amsterdam',
            img: 'https://s3.eu-central-1.amazonaws.com/aviata-blog-2.0/blog/categories/amsterdam_60.png',
        },
        {
            id: 10,
            name: 'Berlin',
            img: 'https://media.istockphoto.com/id/486585530/photo/berlin-skyline-with-spree-river-at-sunset-germany.jpg?s=612x612&w=0&k=20&c=COfGf3zm3CDWUUKv8Kowew73ie5wGr8DfJ0gd88EafQ=',
        },
        {
            id: 11,
            name: 'Warsaw',
            img: 'https://triplook.me/media/resorts/photo/a/0/rf4.jpg',
        },
        {
            id: 12,
            name: 'Riga',
            img: 'https://ic.pics.livejournal.com/kolllak/14380162/4393165/4393165_original.jpg',
        },
    ]

    var Memory = {
        //создаем карточку
        init: function (cards) {
            //получаем доступ к классам
            this.$game = $('.game');
            this.$modal = $('.modal');
            this.$overlay = $('.modal-overlay');
            this.$restartButton = $('button.restart');
        //    собираем из карточек массив - игровое поле
            this.cardsArray = $.merge(cards, cards);
        //    перемешиваем карточки
            this.shuffleCards(this.cardsArray);
        //    и раскладываем их
            this.setup();
        },

    //    как перемешиваются карточки
        shuffleCards: function(cardsArray){
        //    используем встроенный метод shuffle
            this.$cards = $(this.shuffle(this.cardsArray));
        },

    //    раскладываем карты
        setup: function(){
            this.html = this.buildHTML();
        //    добавляем код в блок с игрой
            this.$game.html(this.html);
        //    получаем доступ к сформированным карточкам
            this.$memoryCards = $('.card');
        //    на старте мы не ждем переворота второй карточки
            this.paused = false;
        //    на старте у нас нет перевернутой первой карточки
            this.guess = null;
        //    добавляем элементам на странице реакции на нажатия
            this.binding();
        },

    //    реакция элементов на нажатие
        binding: function(){
        //    обрабатываем нажатие на карточку
            this.$memoryCards.on('click', this.cardClicked);
        //    и нажатие на кнопку перезапуска игры
            this.$restartButton.on('click', $.proxy(this.reset, this))
        },

    //    при нажатии на клавишу
        cardClicked: function(){
        //    получаем текущее состояние родительской переменной
            var _ = Memory;
        //    и получаем доступ к карточке, на которую нажали
            var $card = $(this);
        //    если эта карточка еще не открыта
            if(!_.paused && !$card.find('.inside').hasClass('matched') && !$card.find('.inside').hasClass('picked')){
            //    переворачиваем ее
                $card.find('.inside').addClass('picked');
            //    если мы перевернули первую карточку
                if(!_.guess){
                //    то пока просто запоминаем ее
                    _.guess = $(this).attr("data-id");
                //    если мы перевернули вторую, и она совпадает с первой
                } else if(_.guess == $(this).attr('data-id') && !$(this).hasClass('picked')){
                //    оставляем обе перевернутыми и показываем анимацию совпадения
                    $('.picked').addClass('matched');
                //    обнуляем первую карточку
                    _.guess = null;
                } else {
                //    обнуляем первую карточку
                    _.guess = null;
                //    не ждем переворота второй карточку
                    _.paused = true;
                //    ждем полсекунды и переворачиваем все обратно
                    setTimeout(function (){
                        $('.picked').removeClass('picked');
                        Memory.paused = false;
                    }, 600);
                }
            //    если мы перевернули все карточки
                if($('.matched').length == $('.card').length){
                //    показываем сообщение о победе
                    _.win();
                }
            }
        },

    //    победное сообщение
        win: function(){
        //    не ждем переворота карточек
            this.paused = true;
        //    показываем попап
            setTimeout(function (){
                Memory.showModal();
                Memory.$game.fadeOut();
            }, 1000);
        },

        showModal: function(){
            this.$overlay.show();
            this.$modal.fadeIn('slow');
        },

        hideModal: function(){
            this.$overlay.hide();
            this.$modal.hide();
        },

        //перезапуск игры
        reset: function(){
        //    скрываем попап
            this.hideModal();
        //    перемешиваем карточки
            this.shuffleCards(this.cardsArray);
        //    раскладываем их
            this.setup();
        //    показываем поле
            this.$game.show('slow');
        },

        //тасование Фишера-Йетса
        shuffle: function(array){
            var counter = array.length, temp, index;
            while (counter > 0){
                index = Math.floor(Math.random() * counter);
                counter--;
                temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
            return array;
        },

        //добавление карточек на страницу
        buildHTML: function(){
        //    место для html
            var frag = '';
        //    перебор всех карточек
            this.$cards.each(function(k, v){
            //    код для карточки
                frag += '<div class="card" data-id="'+ v.id +'"><div class="inside">\
			<div class="front"><img src="'+ v.img +'"\
			alt="'+ v.name +'" /></div>\
			<div class="back"><img src="https://images.unsplash.com/photo-1576836165612-8bc9b07e7778?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80"\
			alt="Codepen" /></div></div>\
			</div>';
            });
            return frag;
        }
    };

    Memory.init(cards);
})();