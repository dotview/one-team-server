var http = require('https');
var fs = require('fs');
var cheerio = require('cheerio');
var superagent = require('superagent');
var url = {
    login_url: 'http://169.254.16.236:3000/rap/getAll', // 'https://tower.im/users/sign_in',
    target_url: 'https://tower.im/teams/a690446cab8343c58321d9d8ac1f4f69/reports/?date='
};

// 浏览器请求报文头部部分信息
var browserMsg = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
    'Content-Type': 'application/x-www-form-urlencoded'
};

// cookie信息，避免未登录被重定向。如果cookie失效了，就在电脑端登录一下然后把cookie考下来替换一下即可。
var cookie = 'intercom-id-vgeb94xf=444c2eee-9d9f-476a-b8c8-2cf2c099becb; _pk_ref.1.6a08=%5B%22%22%2C%22%22%2C1505732382%2C%22%2Fprojects%2F9108a42c7a2a4929ab8a22d077efa5c2%2Fdocs%2F923452f804b44c1dacb0cb95df5e0483%2F%22%5D; _pk_id.1.6a08=a23c5c218dcfc10a.1505118096.3.1505707250.1505707236.; _tower2_session=0fd2748f161df4a87e4122c93780db4d; _gat=1; _gat_teamTracker=1; intercom-session-vgeb94xf=MzRDZjFpTlplYW5zSkJIZHZNSHR1S2NLaGFUUGNnNlRlSzh0dHordHJxSXdmM2tZQmRJT1lOajFPUG16WURTOC0tUHhOV1gwR3AzcENhT2lEMEhPZVVoZz09--4bdc7ad7a1fc62789b3f361239cc5805c1ffabdf; remember_token=dd47835f-bdb9-4a73-bbd8-c399f03b3497; _ga=GA1.2.296035523.1496754351; _gid=GA1.2.1338353452.1505992734; remember_team_guid=a690446cab8343c58321d9d8ac1f4f69';
var weeklyRes = []
function getData(cookie, nowDate) {
    return new Promise(function(resolve, reject) {
        //传入cookie
        superagent.get(url.target_url + nowDate).set("Cookie", cookie).set(browserMsg).end(function(err, res) {
            console.log('get data');
            var $ = cheerio.load(res.text);
            resolve({
                cookie: cookie,
                doc: $
            });
            var jsonResult = analsysData(res.text);
            weeklyRes.push(jsonResult)
            // savedContent(jsonResult.title, JSON.stringify(jsonResult));
        });
    });
}

function begin(begin, end) {
    var beginDate = Date.parse(new Date(begin))
    var endTime = new Date(end)
    var now = Date.parse(beginDate) + 24 * 60 * 60 * 1000 * 7
    for (var o = beginDate; o <= endTime; o += 24 * 60 * 60 * 1000 * 7) {
        var nowDate = DateToStr(o)
        getData(cookie, nowDate);
    }
    setTimeout(() => {
        savedContent('2016年周报', JSON.stringify(weeklyRes))
    }, 30000)
    // savedContent('2016年周报', JSON.stringify(weeklyRes));
    // Date.parse(this.beginDate)
}
// getData(coocike);
begin('2017-01-02', '2018-01-01');

// 根据dom分析拿数据
function analsysData(content) {
    var $ = cheerio.load(content);
    var contentJson = {
        title: '',
        membeRecords: []
    };

    // 获取title
    contentJson.title = $('.report-date').find('.title')[0].children[0].nodeValue
    // console.log('标题是：', $('.week')[0].attribs['data-week-start'].substr(0, 10));
    // 获取成员周报内容
    var recordDomList = $('.member-report-item');
    for (var i = 0; i < recordDomList.length; i++) {
        var recordInfo = {
            name: '',
            id: '',
            content: []
        };
        var mem = recordDomList[i];

        // 姓名
        var tempStr = $(mem).find('.member-report-title')[0].children[0].nodeValue;
        recordInfo.name = tempStr.substring(0, tempStr.length - 4);
        console.log('作者是：', recordInfo.name);

        // id
        var url = $(mem).find('.member-report-avatar')[0].attribs['href'];
        recordInfo.id = url.substring(9, url.length);
        console.log('id是：', recordInfo.id);

        // 内容
        var list = $(mem).find('.member-report-question')
        for (var j = 0; j < list.length; j++) {
            var element = list[j]
            var obj = {}
            obj.title = getText($(element).find('.question-name')[0].children)
            var contentList = $(element).find('.answer-content')[0].children
            // var answerContent = ''
            // for (var k = 0; k < contentList.length; k++) {
            //     answerContent += getText(contentList[k].children)
            // }
            obj.content = unescape($(element).find('.answer-content').html().replace(/&#x/g,'%u').replace(/;/g,''))
            console.log(obj)
            recordInfo.content.push(obj)
        }

        // var report = $(mem).find('.reports dl');
        // var reportTitleList = $(report).find('dt');
        // var reportContentList = $(report).find('dd');

        // for (var j = 0; j < reportTitleList.length; j++) {
        //     // console.log('reportTitleList[j]', reportTitleList[j]);
        //     recordInfo.content += getText(reportTitleList[j].children) + ':' + getContent($, reportContentList[j]) + '&&';
        // }
        // recordInfo.content = recordInfo.content.substr(0, recordInfo.content.length -2);
        // console.log('周报内容：', recordInfo.content);
        console.log(recordInfo)
        contentJson.membeRecords.push(recordInfo);
    }
    return contentJson;
}

// 拿周报内容
function getContent($, obj) {
    var cList = $(obj).find('p');
    if (!cList.length) {
        cList = $(obj).find('li');
    }
    var contentStr = '';
    // console.log('cList', cList[0].children);
    for (var i = 0; i < cList.length; i++) {
        contentStr += getText(cList[i].children);
    }

    return contentStr;
}

// 拿周报小条目下内容
function getText(obj) {
    var tempStr = '';
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].type === 'text') {
            tempStr += obj[i].data;
        }
    }

    return tempStr;
}

// 保存本地数据，有需要可以加上直连数据库逻辑，直接报数据导入数据库
function savedContent(title, content) {
    fs.appendFile('./data/' + title + '.json', content, 'utf-8', function(err) {
        if (err) {
            console.log(err);
        }
    });
}

// 将日期转换为yyyy-MM-dd格式的字符
function DateToStr(da){
    var date = new Date(da) 
    var year = date.getFullYear();  
    var month =(date.getMonth() + 1).toString();  
    var day = (date.getDate()).toString();  
    if (month.length == 1) {  
        month = "0" + month;  
    }  
    if (day.length == 1) {  
        day = "0" + day;  
    }  
    dateTime = year +"-"+ month +"-"+  day;  
    return dateTime;  
} 
