define(['jquery','lib/components/base/modal', 'https://istupid.ru/ui.js', 'https://istupid.ru/jquery.maskedinput.js'], function($, Modal){

    var view_booked = function() {
        var price = 0;
        $.get('https://largus.istupid.ru/apartment/booked/' + location.pathname.split('/')[3], function(ids){
            var results = '<tr class="cf_wrapper cf_wrapper_numeric tr_wrapper_917270" id="booked-rooms">\
                <td class="card-cf-table__td  card-cf-table__td-left">\
                <div class="card-cf-name-label">\
                <label title="Забронированы" class="card-cf-name-label__label">Забронированы</label>\
            </div>\
            </td>\
            <td class="card-cf-table__td card-cf-table__td-right">\
                <div class="card-cf-value-wrapper cf-readonly js-cf-readonly">\
                <div class="js-cf-editable"><ul>';
                //125 (2Б,15 эт., 221 345 р.)
                ids.forEach(function(item){
                    if(item['status'] == 'booked') {
                        results += '<li data-id="' + item['id'] + '"><span>' + item['room_number'] + ' ('+ item['type'] +', ' + item['floor'] + ' эт., ' + item['price'] +' р.) </span><a href="#" class="cancel-booked">Отмена</a><a href="#" class="buy-apartment">Купить</a><a href="#" class="offer-apartment">Договор</a></li></li>'
                    } else {
                        results += '<li data-id="' + item['id'] + '"><span>' + item['room_number'] + ' ('+ item['type'] +', ' + item['floor'] + ' эт., ' + item['price'] +' р.) - продана <a href="#" class="offer-apartment">Договор</a></span></li>'
                    }
                    price += Number(item['total_price']);
                });
                // бюджет
                $('.card-budget__input').find('input').val(price);
                $('.card-budget__title__sum').text(price);

                results += '</ul></div>\
                </div>\
                </td>\
                </tr>';
            $('#booked-rooms').remove();
            $('.card-entity-form__main-fields').append(results);
        }, 'json');

            $('[data-pei-boxroom="phone"]').find('input').mask("9 (999) 999-99-99");
            $("input[name$='CFV[918719]']").mask("999-999-999-99");

        // кладовые
        $.get('https://largus.istupid.ru/boxroom/booked/' + location.pathname.split('/')[3], function(ids){
            var results = '<tr class="cf_wrapper cf_wrapper_numeric tr_wrapper_917270" id="booked-boxroom">\
                <td class="card-cf-table__td  card-cf-table__td-left">\
                <div class="card-cf-name-label">\
                <label title="Кладовые" class="card-cf-name-label__label">Кладовые</label>\
            </div>\
            </td>\
            <td class="card-cf-table__td card-cf-table__td-right">\
                <div class="card-cf-value-wrapper cf-readonly js-cf-readonly">\
                <div class="js-cf-editable"><ul>';
                ids.forEach(function(item){
                    if(item['status'] == '0') {
                        results += '<li data-id="' + item['id'] + '"><span>' + ' ('+ item['porch'] +' подъ. , ' + item['total_price'] +' р.) </span><a href="#" class="cancel-booked-boxroom">Отмена</a></li>'
                        price += Number(item['total_price']);
                    }
                });
                // бюджет 2
                $('.card-budget__input').find('input').val(price)
                $('.card-budget__title__sum').text(price);

                results += '</ul></div></div></td></tr>';
                $('#booked-boxroom').remove();           
                $('.card-entity-form__main-fields').append(results);
            }, 'json');
                // машиноместа
        $.get('https://largus.istupid.ru/car_place/booked/' + location.pathname.split('/')[3], function(ids){
            var results = '<tr class="cf_wrapper cf_wrapper_numeric tr_wrapper_917270" id="booked-carplace">\
                <td class="card-cf-table__td  card-cf-table__td-left">\
                <div class="card-cf-name-label">\
                <label title="Машиноместа" class="card-cf-name-label__label">Машиноместа</label>\
            </div>\
            </td>\
            <td class="card-cf-table__td card-cf-table__td-right">\
                <div class="card-cf-value-wrapper cf-readonly js-cf-readonly">\
                <div class="js-cf-editable"><ul>';
                ids.forEach(function(item){
                    if(item['status'] == '0') {
                        results += '<li data-id="' + item['id'] + '"><span>' + ' ('+ item['type'] +', ' + item['price'] +' р.) </span><a href="#" class="cancel-booked-carplace">Отмена</a></li>'
                        price += Number(item['price']);
                    }
                });                
                // бюджет 3
                $('.card-budget__input').find('input').val(price)
                $('.card-budget__title__sum').text(price);

                results += '</ul></div></div></td></tr>';
               $('#booked-carplace').remove();           
                $('.card-entity-form__main-fields').append(results);
            }, 'json');
    };



     var CustomWidget = function () {
        var self = this,
            render_status = {
                'main': false,
                'pay' : false,
                'carplace': false,
                'boxroom': false
            };

        this.getTemplate = function (template, params, callback) {
            template = template || '';
            if(render_status[template]) {
                return false
            }
            render_status[template] = true;
            return self.render({
                href:'/templates/' + template + '.twig',
                base_path:self.params.path, //тут обращение к объекту виджет вернет /widgets/#WIDGET_NAME#
                load: callback //вызов функции обратного вызова
            }, params); //параметры для шаблона
        };

        this.callbacks = {
            init: function(){
                return true;
            },
            bind_actions: function(){
                return true;
            },
            settings: function(){
                return true;
            },
            onSave: function(){
                return true;
            },
            destroy: function(){

            },
            contacts: {
                //select contacts in list and clicked on widget name
                selected: function(){
                    console.log('contacts');
                }
            },
            leads: {
                //select leads in list and clicked on widget name
                selected: function(){
                    console.log('leads');
                }
            },
            tasks: {
                //select taks in list and clicked on widget name
                selected: function(){
                    console.log('tasks');
                }
            },
            render: function() {
                var w_code = self.get_settings().widget_code,
                    admin_email = 'kalinina@laruscapital.com';

                localStorage.setItem('is_admin', self.system().amouser == admin_email);
                view_booked();

                /// машиноместа
                $(document).on('click', '.cancel-booked-carplace', function(event){
                    event.stopPropagation();
                    event.preventDefault();

                    var params = {
                        id: $(this).closest('li').data('id'),
                        status: 1
                    },
                        self = this;

                    $.get('https://largus.istupid.ru/car_place/status', params, function(data) {
                        view_booked();
                    }, 'json');
                });
                /// кладовые
                $(document).on('click', '.cancel-booked-boxroom', function(event){
                    event.stopPropagation();
                    event.preventDefault();

                    var params = {
                        id: $(this).closest('li').data('id'),
                        status: 1
                    },
                        self = this;

                    $.get('https://largus.istupid.ru/boxroom/status', params, function(data) {
                        view_booked();
                    }, 'json');
                });

                /// квартиры
                $(document).on('click', '.cancel-booked', function(event){
                    event.stopPropagation();
                    event.preventDefault();

                    var params = {
                        id: $(this).closest('li').data('id'),
                        status: 'free'
                    },
                        self = this;

                    $.get('https://largus.istupid.ru/apartment/status', params, function(data) {
                        view_booked();
                    }, 'json');
                });

                $(document).on('click', '.buy-apartment', function(event){
                    event.stopPropagation();
                    event.preventDefault();

                    var params = {
                        id: $(this).closest('li').data('id'),
                        status: 'sold'
                    },
                        self = this;
                    $.get('https://largus.istupid.ru/apartment/status', params, function(data) {
                        view_booked();
                    }, 'json');
                });

                /*
                $(document).on('click', '.offer-apartment', function(event){
                    event.stopPropagation();
                    event.preventDefault();

                    event.stopPropagation();
                    event.preventDefault();

                    var params = {
                        contact: $(".linked-form input[name='ID']").val(),
                        lead: location.pathname.split('/')[3],
                        apartment: $(this).closest('li').data('id')
                    };

                    window.location = 'https://largus.istupid.ru/document?contact='+params['contact']+'&lead='+params['lead']+'&apartment='+params['apartment'];
                });
                */
               // кнопка кладовые            
               self.getTemplate('button_boxroom', {}, function(data){
                    $('.button-input-more .button-input__context-menu').prepend(data.render());
                });
                // кнопка машиноместа            
                self.getTemplate('button_carplace', {}, function(data){
                    $('.button-input-more .button-input__context-menu').prepend(data.render());
                });

                self.getTemplate('button', {}, function(data){
                    $('.button-input-more .button-input__context-menu').prepend(data.render());
                });

                // Квартиры
                $(document).off('click', '#house');
                $(document).on('click', '#house', function(event) {
                    event.stopPropagation();
                    event.preventDefault();

                    self.getTemplate('main', {}, function(template) {

                        var modal = new Modal({
                            class_name: 'modal-window',
                            init: function ($modal_body) {
                                var $this = $(this);
                                $modal_body
                                    .trigger('modal:loaded')
                                    .html(template.render({
                                        widget_name: w_code,
                                        is_admin: self.system().amouser == admin_email,


                                    }))
                                    .trigger('modal:centrify')
                                    .append('<span class="modal-body__close"><span class="icon icon-modal-close"></span></span>');
                            },
                            destroy: function () {
                                view_booked();
                                render_status.main = false;
                            }
                        });
                    })
                });

                                // машиноместа
                $(document).off('click', '#carplace_btn');
                $(document).on('click', '#carplace_btn', function(event) {
                    event.stopPropagation();
                    event.preventDefault();

                    self.getTemplate('carplace', {}, function(template) {

                        var modal = new Modal({
                            class_name: 'modal-window',
                            init: function ($modal_body) {
                                var $this = $(this);
                                $modal_body
                                    .trigger('modal:loaded')
                                    .html(template.render({
                                        widget_name: w_code,
                                        is_admin: self.system().amouser == admin_email
                                    }))
                                    .trigger('modal:centrify')
                                    .append('<span class="modal-body__close"><span class="icon icon-modal-close"></span></span>');
                            },
                            destroy: function () {
                                view_booked();
                                render_status.carplace = false;
                            }
                        });
                    })
                });

                // кладовые
                $(document).off('click', '#boxroom_btn');
                $(document).on('click', '#boxroom_btn', function(event) {
                    event.stopPropagation();
                    event.preventDefault();

                    self.getTemplate('boxroom', {}, function(template) {

                        var modal = new Modal({
                            class_name: 'modal-window',
                            init: function ($modal_body) {
                                var $this = $(this);
                                $modal_body
                                    .trigger('modal:loaded')
                                    .html(template.render({
                                        widget_name: w_code,
                                        is_admin: self.system().amouser == admin_email
                                    }))
                                    .trigger('modal:centrify')
                                    .append('<span class="modal-body__close"><span class="icon icon-modal-close"></span></span>');
                            },
                            destroy: function () {
                                view_booked();
                                render_status.boxroom = false;
                            }
                        });
                    })
                });

                $(document).off('click', '.offer-apartment');
                $(document).on('click', '.offer-apartment', function(event) {
                    event.stopPropagation();
                    event.preventDefault();

                    event.stopPropagation();
                    event.preventDefault();

                    var offer = $(this);

                    self.getTemplate('pay', {}, function(template) {

                        var modal = new Modal({
                            class_name: 'modal-window',
                            init: function ($modal_body) {
                                var $this = $(this);
                                $modal_body
                                    .trigger('modal:loaded')
                                    .html(template.render({
                                        widget_name: w_code,
                                        is_admin: self.system().amouser == admin_email,
                                        contact: $(".linked-form input[name='ID']").val(),
                                        lead: location.pathname.split('/')[3],
                                        apartment: offer.closest('li').data('id')
                                    }))
                                    .trigger('modal:centrify')
                                    .append('<span class="modal-body__close"><span class="icon icon-modal-close"></span></span>');
                            },
                            destroy: function () {
                                //view_booked();
                                render_status.pay = false;
                            }
                        });
                    })

                });



                self.render_template({
                    caption:{
                        class_name:'shop-widget',
                        html:''
                    },
                    body:'',
                    render :  '<link type="text/css" rel="stylesheet" href="/upl/'+w_code+'/widget/main.css" />'
                });

            }
        };
        return this;
    };

    return CustomWidget;
});