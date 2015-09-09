/**
 * 秒车-倒计时
 * CodeBy:Mr.Co
 * Date:15/9/8
 */
;(function(win,$,undeinfed){
    'use struct';

    /*
     * 用于存储时间记录器对象队列,便于删除
     **/
    win.mcClockStore = [];

    /*
     * 倒计时
     * args     object      配置参数对象
     **/
    var clock = function(args){
        this.OPTIONS = $.extend({
            element:null,                                //当前倒计时DOM容器
            startTime:new Date('2015/9/5 23:26:00'),     //开始时间(暂时不用)
            endTime:new Date('2015/9/10 23:00:00'),      //结束时间
            nowTime_Server:new Date('2015/9/8 18:01:55'),//服务器时间
            nowTime_Client:new Date(),                   //客户端时间
            param:0,                                     //客户端和服务器时间校准参数
            timer:null                                   //秒针统计器
        },args);
        this.OPTIONS.param = this.OPTIONS.nowTime_Client - this.OPTIONS.nowTime_Server;
        this.createTimeElement();

        //如果之前已经开始过倒计时，需要先干掉
        var _clockObjIndex = this.OPTIONS.element.attr('mc-clock-idx');
        if(_clockObjIndex){
            console.log(win.mcClockStore);
            this.clearCountTime(win.mcClockStore[_clockObjIndex].OPTIONS.timer);
        }
    }

    /*
     * 时钟原生对象引用
     **/
    clock.fn = clock.prototype;

    /*
     * 创建时间DOM元素
     **/
    clock.fn.createTimeElement = function(){
        var _timeHtml = [
            '<span data-time="dd" class="mc-clock-time">0</span>',
            '<span class="mc-clock-txt">天</span>',
            '<span data-time="hh" class="mc-clock-time">0</span>',
            '<span class="mc-clock-txt">时</span>',
            '<span data-time="mm" class="mc-clock-time">0</span>',
            '<span class="mc-clock-txt">分</span>',
            '<span data-time="ss"class="mc-clock-time">0</span>'
        ].join('');
        this.OPTIONS.element.html(_timeHtml);

        return this;
    }

    /*
     * 设置秒针计时后的时间
     * @time    number      时间戳
     **/
    clock.fn.setTime = function(time){
        var _d = Math.floor(time / (1000 * 60 * 60 * 24)),
            _h = Math.floor(time / (1000 * 60 * 60)) % 24,
            _m = Math.floor(time / (1000 * 60)) % 60,
            _s = Math.floor(time / 1000) % 60,
            _el = this.OPTIONS.element,
            _format = function(t){
                return t < 10 ? '0' + t : t;
            }

        _el.children('span[data-time=dd]').text(_format(_d));
        _el.children('span[data-time=hh]').text(_format(_h));
        _el.children('span[data-time=mm]').text(_format(_m));
        _el.children('span[data-time=ss]').text(_format(_s));

        return this;
    }

    /*
     * 开始倒计时
     **/
    clock.fn.startTime = function(){
        var _this = this,
            _nowTime = new Date(),
            _nms,_ems;

        //客户端和服务器时间校准
        _nowTime.setTime(_nowTime.getTime() - _this.OPTIONS.param);
        _nms = _nowTime - _this.OPTIONS.startTime;
        _ems = _this.OPTIONS.endTime - _nowTime;

        if(_nms > 0 && _ems > 0){
            _this.setTime(_ems);
        }
        //else if(_nms < 0) {
        //    console.log('还未开始');
        //}
        else if(_ems < 0){
            console.log('已经结束');
            _this.setTime(0);
            return;
        }

        _this.OPTIONS.timer = setTimeout(function(){
            _this.startTime();
        }, 1000);

        return this;
    }

    /*
     * 清除计时对象
     * @timer   object      时间计时对象
     **/
    clock.fn.clearCountTime = function(timer){
        clearTimeout(timer);

        return this;
    }

    if(!$){
        throw new Error('错误：未找到jQuery类库，请先引用jQuery类库后再使用mc.clock.js');
    }

    /*
     * 设置为公共类，提供给外部调用
     **/
    win.mcClock = clock;

    /*
     * 初始化倒计时
     **/
    $(function(){
        $('[mc-clock-id]').each(function(i){
            var _$this = $(this),
                _clock;

            //设置倒计时
            _clock = new clock({
                element:_$this,
                //startTime:new Date(_$this.attr('start-time')),
                endTime:new Date(_$this.attr('end-time')),
                nowTime_Server:new Date(_$this.attr('server-time'))
            }).startTime();

            //添加到倒计时队列
            mcClockStore.push(_clock);
            //记录当前对象的队列索引
            _$this.attr('mc-clock-idx',i);
        });
    });
}(window,jQuery));