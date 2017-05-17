define(['jquery','lib/components/base/modal', 'https://istupid.ru/ui.js', 'https://istupid.ru/jquery.maskedinput.js'], function($, Modal){

    var view_booked = function() {
        $.get('https://s.aerealty.ru/apartment/booked/' + location.pathname.split('/')[3], function(ids){
            var results = '<tr class="cf_wrapper cf_wrapper_numeric tr_wrapper_917270" id="booked-rooms">\
                <td class="card-cf-table__td  card-cf-table__td-left">\
                <div class="card-cf-name-label">\
                <label title="Забронированы" class="card-cf-name-label__label">Забронированы</label>\
            </div>\
            </td>\
            <td class="card-cf-table__td card-cf-table__td-right">\
                <div class="card-cf-value-wrapper cf-readonly js-cf-readonly">\
                <div class="js-cf-editable"><ul>';
                var price = 0;
                ids.forEach(function(item){
                    if(item['status'] == 'booked') {
                        results += '<li data-id="' + item['id'] + '" data-days="' + item['days'] + '" data-cash_sum="' + item['cash_sum'] + '" data-credit_sum="' + item['credit_sum'] + '" data-date_agreement="' + item['date_agreement'] + '" data-date_agreement_mortgage="' + item['date_agreement_mortgage'] + '"  data-agreement_mortgage="' + item['agreement_mortgage'] + '"><span class="apartment-info">' + item['room_number'] + '</span><a href="#" class="cancel-booked">Отмена</a><a href="#" class="buy-apartment">Купить</a>' + get_documents_name() + ' </li>'
                    } else {
                        results += '<li data-id="' + item['id'] + '" data-days="' + item['days'] + '" data-cash_sum="' + item['cash_sum'] + '" data-credit_sum="' + item['credit_sum'] + '" data-date_agreement="' + item['date_agreement'] + '" data-date_agreement_mortgage="' + item['date_agreement_mortgage'] + '"  data-agreement_mortgage="' + item['agreement_mortgage'] + '"><span class="apartment-info">' + item['room_number'] + ' - продана ' + get_documents_name() + ' </span></li>'
                    }
                    price += Number(item['total_price']);
                });
                $('.card-budget__input').find('input').val(price);
                $('.card-budget__title__sum').text(price);
                results += '</ul></div>\
                </div>\
                </td>\
                </tr>';
            $('#booked-rooms').remove();
            $('.card-entity-form__main-fields').append(results);

            $.get('https://s.aerealty.ru/templates', {}, function(data) {
                var result = '';
                for(var i = 0; i < data.length; i++) {
                    result += "<option value='" + data[i] + "'>" + data[i] + "</option>";
                }
                $('.ae-document-select').append(result);
            }, 'json');
        }, 'json');

        $('[data-pei-code="phone"]').find('input').mask("9 (999) 999-99-99");
        $("input[name$='CFV[918719]']").mask("999-999-999-99");

        
    };

    var add_role_page = function() {
        $(document).off('click', '#role_link');
        $(document).on('click', '#role_link', function(event) {
            $.get('https://s.aerealty.ru/roles', {}, function(data) {
                $('#work_area').html(data);
            })
        });
        if($('.filter__common_settings').length > 0) {
            var data = '<li class="filter__list__item  js-filter-preset-link" title="Роли"><a href="/settings/roles" class="js-navigate-link navigate-link-nodecor" id="role_link">Настройки AERealty</a></li>';
            $('.filter__common_settings__list_wrapper').find('.filter__list').append(data);
        }

        $(document).off('#settings_role_form', 'submit');
        $(document).on('#settings_role_form', 'submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        });

        $(document).off('#save_role_button', 'click');
        $(document).on('#save_role_button', 'click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        });
    };

    //var load_roles = function

    var get_cookie = function() {
        var cook = document.cookie.split('; '),
            parts = [],
            rv = [];
        for(var i = 0; i < cook.length; i++) {
            parts = cook[i].split('=');
            rv[parts[0]] = parts[1];
        }
        return rv;
    };

    var get_documents_name = function() {
        return '<select name="document" class="ae-document-select"><option value="">Выбрать</option></select>';
    };



    var check_access = function(role) {
        //remove buy link if manager and offer is not apply
        var has_aprooved = $('span:contains("Договор одобрен")').closest('.linked-form__field').find('input').is(':checked');
        if(role == 'manager' && !has_aprooved) {
            var boocked_block = $('#booked-rooms');
            if(boocked_block.length > 0) {
                $(boocked_block).find('.buy-apartment').remove();
            }
        }

        if($('.card-tabs__item-inner[title="Руководство"]').length > 0) {
            if(role == 'manager' ) {
                $('.card-tabs__item-inner[title="Руководство"]').closest('.card-tabs__item').remove();
            }
        }
    };



    var CustomWidget = function () {
        var self = this,
            render_status = {
                'main': false
            };

        this.getTemplate = function (template, params, callback) {
            params = (typeof params == 'object') ? params : {};
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

        this.show_document_popup = function(params, obj) {
            self.getTemplate('document_form', params, function(template) {
                var modal = new Modal({
                    class_name: 'modal-window ae-realty_document_form',
                    init: function ($modal_body) {
                        $modal_body
                            .trigger('modal:loaded')
                            .html(template.render(params))
                            .trigger('modal:centrify')
                            .append('<span class="modal-body__close"><span class="icon icon-modal-close"></span></span>');
                    },
                    destroy: function () {
                    }
                });
            });
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
                // Согласование договора
                
                var checkboxes = []
                $("input[type=checkbox][name^=CFV]").each(function(){
                    if($(this).is(":checked")){}else{
                        checkboxes.push(false)
                    }
                })
                if(checkboxes.indexOf(false) !== -1){
                    $(".card-entity-form__main-fields").prepend("<div class='disagreed' style='border-bottom: 3px solid red'>Договор не согласован</div>")
                }else{
                    $(".card-entity-form__main-fields").prepend("<div class='agreed'  style='border-bottom: 3px solid green'>Договор согласован</div>") 
                }

                // скрываю Компанию
                $('.company_contacts__company').hide()
                // расчитываю цену Бюджета
                var price_inp = $('input[name="lead[PRICE]"][type=text]')
                price_inp.val(parseInt(price_inp.val() - price_inp.val()/ 100 * 3.5 ))
                // скрываю Юриста, Фин. рук, Рук-ля
                /*var relations = {
                "Руководитель" : "Руководитель",
                "Юристы ДДУ" : "Юрист",
                "Тарасова Евгения Алексеевна" : "Руководитель",
                "Финансовая служба" : "Финансовый директор"
                }

                $(".linked-form__field-checkbox").each(function(){
                    var work_position = $(this).find(".linked-form__field__label span").text()
                    var work_name = AMOCRM.data.current_card.user.name
                    
                    if(relations[work_name] != work_position)
                        $(this).hide()
                })*/



                var w_code = self.get_settings().widget_code,
                    role = 'manager';

                $.get('https://s.aerealty.ru/roles/role?email=' + get_cookie()['BITRIX_SM_LOGIN'], function(response) {
                    role = response.role;
                    check_access(role);
                }, 'json');
                view_booked();
                add_role_page();
                $(document).off('click', '.cancel-booked');
                $(document).on('click', '.cancel-booked', function(event){
                    event.stopPropagation();
                    event.preventDefault();

                    var params = {
                        id: $(this).closest('li').data('id'),
                        status: 'free'
                    },
                        self = this;

                    $.get('https://s.aerealty.ru/apartment/status', params, function(data) {
                        view_booked();
                    }, 'json');
                });

                $(document).off('click', '.buy-apartment');
                $(document).on('click', '.buy-apartment', function(event){
                    event.stopPropagation();
                    event.preventDefault();

                    var params = {
                        id: $(this).closest('li').data('id'),
                        status: 'sold'
                    },
                        self = this;
                    $.get('https://s.aerealty.ru/apartment/status', params, function(data) {
                        view_booked();
                    }, 'json');
                });

                $(document).off('click', '#ae-realty-document-form button');
                $(document).on('click', '#ae-realty-document-form button', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var params = [];
                    $(this).closest('form').serializeArray().forEach(function(item, i){
                        params.push(item.name + '=' + item.value);
                    });
                    location.href = 'https://s.aerealty.ru/document/?' + params.join('&');

                });

                $(document).off('change', '.ae-document-select');
                $(document).on('change', '.ae-document-select', function(event) {
                    event.stopPropagation();
                    event.preventDefault();

                    var block = $(this).closest('li'),
                        params = {
                        contact: $(".linked-form input[name='ID']").val(),
                        lead: location.pathname.split('/')[3],
                        template: $(this).val()
                    };

                    ['id', 'days', 'cash_sum', 'credit_sum', 'date_agreement',
                        'date_agreement_mortgage', 'agreement_mortgage'].forEach(function(item, index){
                           params[item] = block.data(item);
                        });

                    // 100% скрываю поле Дата и Скидка
                    params.display_data = "block"
                    if($(this).val().indexOf("100") !== -1){
                        params.display_data = "none"
                    }
                    self.show_document_popup(params, this);
                });

                self.getTemplate('button', {}, function(data){
                    $('.button-input-more .button-input__context-menu').prepend(data.render());
                });
                $(document).off('click', '#house');
                $(document).on('click', '#house', function(event) {
                    event.stopPropagation();
                    event.preventDefault();

                    self.getTemplate('main', {}, function(template) {

                        var modal = new Modal({
                            class_name: 'modal-window ae-realty',
                            init: function ($modal_body) {
                                var $this = $(this);
                                window.localStorage.setItem('ae_realty_role', role);
                                $modal_body
                                    .trigger('modal:loaded')
                                    .html(template.render({
                                        widget_name: w_code,
                                        role: role
                                    }))
                                    .trigger('modal:centrify')
                                    .append('<span class="modal-body__close"><span class="icon icon-modal-close"></span></span>');
                            },
                            destroy: function () {
                                view_booked();
                                render_status.main = false;
                                window.localStorage.removeItem('ae_realty_search_params');
                            }
                        });
                    })
                });

                self.render_template({
                    caption:{
                        class_name:'shop-widget',
                        html:''
                    },
                    body: '',
                    render :  '<link type="text/css" rel="stylesheet" href="/upl/'+w_code+'/widget/main.css" />'
                });

            }
        };
        return this;
    };

    return CustomWidget;
});