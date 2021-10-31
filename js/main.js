// autofocus seach input
function autofocus() {
  var patten = ["phone", "pad", "pod", "iPhone", "iPod", "ios", "iPad", "Android",
   "Mobile", "BlackBerry", "IEMobile", "MQQBrowser", "JUC", "Fennec", "wOSBrowser",
    "BrowserNG", "WebOS", "Symbian", "Windows Phone"
  ].join('|');
  var re = new RegExp(patten, 'i');

  if (!re.test(navigator.userAgent)) {
    $('#search_input').focus()
  }
}

// 点击搜索按钮
function search() {
  var e = document.getElementById("search_input");
  var to = e.dataset.to

  if (e.value != "") {
    window.location.href = to + e.value
  }
  return false;
}

// 点击第一排搜索引擎
var $box = $('.search_type .box')
$box.on('click', function() {
  var $this = $(this)
  var val = $('#search_input').val()
  var prefix = $this.data('to')
  var logo = $this.data('logo')

  if (logo) {
    $('.logo img').removeClass('active')
    $('#' + logo).addClass('active')
    $('#search_input').attr('data-to', prefix)
    $('#logo').attr('href', prefix)

    var current = {
      logo: logo,
      prefix: prefix
    }
    localStorage.setItem('search', JSON.stringify(current))
  }

  window.location.href = prefix + val
})

// 点击单次搜索 LOGO
var $once = $('.box.once')
$once.on('click', function() {
  var $this = $(this)
  var val = $('#search_input').val()
  var prefix = $this.data('to')
  var url;

  if (val === '') {
    url = $this.data('home') ?
      $this.data('home') : prefix.match(/https:\/\/.+?\//)[0]
  } else {
    url = prefix.replace('$$', val)
  }
  window.location.href = url
})

// init
$(function() {
  // 读取默认搜索
  var current = localStorage.getItem('search')

  if (current) {
    current = JSON.parse(current)
    var prefix = current["prefix"]
    var logo = current["logo"]

    $('.logo img').removeClass('active')
    $('#' + logo).addClass('active')
    $('#search_input').attr('data-to', prefix)
    $('#logo').attr('href', prefix)
  }

  autofocus() // focus on input
})

// 隐秘模式==========================================
var proxy_url = ['https://g.hello2019.workers.dev/-----', 'https://jsproxy.cyou/-----',
'https://linkouter.tk/-----', 'https://gamedun.github.io/-----']

// 网址可用性测试实例
var net = new Net()

// 🐵状态实例
var monkey = new Monkey()

// 锁定线路实例
var lockNet = new LockNet(proxy_url)

// 初始化
$(function() {
  var su = localStorage.getItem('SU')

  monkey.init()

  if (su === 'true') {
    openSU()
  } else {
    nosu_test()
  }

  document.addEventListener("visibilitychange", handleVisibilityChange, false);
})


// Class 区================================
function Net() {
  var timelimit = 1500
  this.p = new Ping({
    timeout: timelimit
  })
  this.test = function(url) {
    var p = this.p
    var pro = new Promise(function(resolve, reject) {
      p.ping(url, function(err, ping) {
        console.log('时间：' + ping)
        if (ping < timelimit) {
          resolve(url)
        } else {
          reject('Timeout:' + url)
        }
      })
    })

    return pro
  }
}

function Monkey() {
  this.$dom = $('#monkey')
  this.open = function() {
    this.$dom.removeClass('hide').addClass('show')
    localStorage.setItem('mk', 1)
  }
  this.close = function() {
    this.$dom.removeClass('show').addClass('hide')
    localStorage.setItem('mk', 0)
  }
  this.color = function() {
    this.$dom.removeClass('gray').addClass('color')
  }
  this.gray = function() {
    this.$dom.removeClass('color').addClass('gray')
  }
  this.init = function() {
    var mk = localStorage.getItem('mk')

    if (parseInt(mk)) {
      this.open()
    } else {
      this.close()
    }
  }
}

function LockNet(arr) {
  this.next = function(cb) {
    var num = this.getNum()

    if (!num) {
      localStorage.setItem('lock', 1)
      if (cb) cb(1, arr[0])
      return arr[0]
    }
    if (num >= arr.length) {
      localStorage.setItem('lock', 0)
      if (cb) cb(0, false)
      return false
    }

    localStorage.setItem('lock', ++num)

    if (cb) cb(num, arr[num - 1])
    return arr[num]
  }
  this.getNum = function() {
    return parseInt(localStorage.getItem('lock'))
  }
  this.getVal = function() {
    var num = this.getNum()
    if (num) {
      return arr[num - 1]
    } else {
      return false
    }
  }
}

// 工具函数区======================================
// 弹窗
var notice = function(text) {
  var $notice = $('#notice')

  if (!$notice.length) {
    $notice = $('<div id="notice" class="inout">' + text + '</div>')
    $('body').append($notice)
  } else {
    $notice.html(text).removeClass('inout').show()
    $notice.addClass('inout')
  }
}

// 普通模式网络测试
function nosu_test() {
  net.test('https://youtube.com').then(function() {
    monkey.open()
  }).catch(function(err) {
    monkey.close()
    throw new Error(err)
  })
}

// proxy url 替换
var setProxy = function(prefix) {
  prefix = prefix || ''
  var p = {}
  p.google = prefix + $('#google').data('to')
  p.pic = prefix + $('#picsearch').data('to')
  p.pic_h = prefix + $('#picsearch').data('home')
  p.youtube = prefix + $('#youtube').data('to')
  p.youtube_h = prefix + $('#youtube').data('home')

  if (!prefix) {
    $.each(p, function(key, val) {
      p[key] = val.replace(/https:.+?https/, 'https')
    })
  }

  if ($('#logo-google').hasClass('active')) {
    $('#search_input').attr('data-to', p.google)
  }

  $('#google').attr('data-to', p.google)
  $('#picsearch').attr('data-to', p.pic)
  $('#picsearch').attr('data-home', p.pic_h)
  $('#youtube').attr('data-to', p.youtube)
  $('#youtube').attr('data-home', p.youtube_h)
}

// 检测网络，设置 proxy mode
var setMode = function() {
  net.test("https://youtube.com").then(function() {
    console.log("Use direct mode.")
    setProxy()
    monkey.open()
  }).catch(function(err) {
    console.log("Use proxy mode.")
    var promise_arr = []
    var lock_val = lockNet.getVal()

    if (lock_val) {
      promise_arr = [net.test(lock_val)]
    } else {
      promise_arr = liveProxy(proxy_url)
    }

    oneSuccess(promise_arr).then(function(prefix) {
      setProxy(prefix)
      monkey.open()
    }).catch(function(e) {
      monkey.close()
      setProxy(proxy_url[0])
      throw new Error(e)
    })
  })
}

// url_arr 生成 promise_arr
var liveProxy = function(url_arr) {
  var promise_arr = []

  $.each(url_arr, function(index, url) {
    var pro = net.test(url)

    promise_arr.push(pro)
  })

  return promise_arr
}

var openSU = function() {
  monkey.color()
  localStorage.setItem('SU', 'true')
  setMode()
}

var offSU = function() {
  monkey.gray()
  localStorage.setItem('SU', 'false')
  nosu_test()
}

// 第一个成功 promise
function oneSuccess(promises) {
  return Promise.all(promises.map(function(p) {
    return p.then(function(val) {
      return Promise.reject(val);
    }, function(err) {
      return Promise.resolve(err);
    });
  })).then(
    function(errors) {
      return Promise.reject(errors);
    },
    function(val) {
      return Promise.resolve(val);
    });
}

// 事件监听区====================================
$(document).on('click', '#btn-mode', function() {
  if ($('#monkey').hasClass('gray')) {
    openSU()
    notice('智能模式，低调使用!')
  } else {
    offSU()
    notice('普通模式，自力更生!')
  }
})

$(document).on('click', '#monkey.color', function() {
  lockNet.next(function(index, val) {
    if (index) {
      notice('锁定线路：' + index)
    } else {
      notice('自动选线')
    }

    setMode()
  })
})

var handleVisibilityChange = function() {
  if (document.hidden) {
    console.log('Background')
  } else {
    console.log('Front')
    if ($('#monkey').hasClass('gray')) {
      nosu_test()
    } else {
      setMode()
    }
  }
}

// PWA==========================================================================
// sw register
window.addEventListener("load", function() {
  console.log("Will the service worker register?");

  navigator.serviceWorker.register('/sw.js')
  .then(function(reg){
      console.log("Yes, it did.");
  }).catch(function(err) {
      console.log("No it didn't. This happened: ", err)
  });
});
