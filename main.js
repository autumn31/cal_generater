//document.body.style = "background: black";
// var images=[];
debug = true;
drawtext = false;
var curDateObj = new Date();
var curYear = curDateObj.getFullYear();
var curMonth = curDateObj.getMonth()+1;
$("#access").click(function(){
    // $.get("https://api.instagram.com/oauth/authorize/?client_id=e30d30a12f984aeb861617214be657eb&redirect_uri=http://localhost&response_type=token", function(data, status){
    //     console.log(data);
    //});

    location.href = "https://api.instagram.com/oauth/authorize/?client_id=e30d30a12f984aeb861617214be657eb&redirect_uri=https://autumn31.github.io/cal_generater/index.html&response_type=token";
    
});

$("#top").click(function(){
    $('.loader').show();
    $('#instafeed').empty();
    get_insta();
    // var b = document.getElementById('button');
    // b.disabled = true;
});

$("#month").click(function(){
    $('#instafeed').empty();
    for (i=1;i<13;i++){
        // var can = document.createElement('cavas');
        var can = $('<canvas>')[0];
        can.id = 'can'+i;
        $('#instafeed').append(can);

    }
    for (i=1;i<13;i++){
        var images = [];
        get_insta_by_month(images,curYear,i);
    }
});

$("#pics").click(function(){
    $('#instafeed').empty();
    get_pics(curYear,curMonth);
});

$('document').ready(function(){
    if (debug){
        console.log('after loading');
    }
});

//console.log(location.href.search('access'));
if (location.href.search('access')!=-1){
    $('#access').hide();
    $('#top').show();
    $('#month').show();
    $('#pics').show();
}



function get_insta(){
    var token = location.href.substr(location.href.search('=')+1);
    var id = token.substr(0,token.search('\\.'));
    // console.log(token.search('\\.'));
    // console.log(token);
    // console.log(id);
    if (debug){
        console.log('recalling');
    }
    var images=[];
    var loadButton = document.getElementById('load-more');
    var feed = new Instafeed({
        get: 'user',
        userId: id,
        accessToken: token,
        //template: '<a href="{{link}}"><img src="{{image}}" /></a>',
        resolution: "standard_resolution",
        sortBy: 'most-recent',
        max_t: new Date(curYear,curMonth),
        min_t: new Date(curYear-2,curMonth-1),
        limit: 50,
        mock: true,
        success: function(response) {
            // console.log('start build');
            images = images.concat(response.data);
            if (feed.hasNext()){
                // console.log('hasnext');
                // console.log(images);
                // console.log(response.data);
                feed.next();
            }else{
                if (debug){
                    console.log("hi")
                }
                images = feed._sortBy(images,'likes.count',false);
                images = images.slice(0,12);
                images.sort(function() {
                    return 0.5 - Math.random();
                });
                $('.loader').hide();
                build_cal(images);
            }
        },
        error: function(){
            console.log('no images');
        }
    // after: function() {
    //     // disable button if no more results to load
    //     if (!this.hasNext()) {
    //         loadButton.setAttribute('disabled', 'disabled');
    //     }
    // }

});

// $('#next').click(function(){
//     feed.next();
// });
feed.run();
}

function get_insta_by_month(images,cury,i){
    var y=cury;
    var sy=y;
    var si=i-1;
    if (i===1){
        sy=y-1;
        si=12;
    }
    var token = location.href.substr(location.href.search('=')+1);
    var id = token.substr(0,token.search('\\.'));
    // var images=[];
    var loadButton = document.getElementById('load-more');
    var feed = new Instafeed({
        get: 'user',
        userId: id,
        accessToken: token,
        //template: '<a href="{{link}}"><img src="{{image}}" /></a>',
        resolution: "standard_resolution",
        sortBy: 'most-recent',
        max_t: new Date(y,i),
        min_t: new Date(sy,si),
        limit: 50,
        mock: true,
        success: function(response) {
            if (debug){
                console.log('response of '+y+', '+i);
            }
            images = images.concat(response.data);
            if (feed.hasNext()){
                feed.next();
            }
            else {
                if (y!=cury-2&&images.length<8){
                    images = images.concat(response.data);
                    y--;
                    get_insta_by_month(images,y,i);
                }else{
                    //console.log(images);
                    feed._sortBy(images,'likes.count',false);
                    // var can = document.createElement('canvas');
                    // $('#instafeed').append(can);
                    if (debug){
                        console.log('adding images of '+i);
                    }
                    if (images[0]===undefined){
                        add_pic(document.getElementById('can'+i),'',i);
                    }else{
                        add_pic(document.getElementById('can'+i),images[0],i);
                    }
                    
                }
            }
        },
        error: function(){
            console.log('no images');
        }
    // after: function() {
    //     // disable button if no more results to load
    //     if (!this.hasNext()) {
    //         loadButton.setAttribute('disabled', 'disabled');
    //     }
    // }

    });

// $('#next').click(function(){
//     feed.next();
// });
    feed.run();
}

function get_pics(){
    date = new Date()
    sdate = new Date()
    sdate.setMonth(date.getMonth()-1)
    y = date.getFullYear()
    i = date.getMonth()
    sy = sdate.getFullYear()
    si = sdate.getMonth()

    var token = location.href.substr(location.href.search('=')+1);
    var id = token.substr(0,token.search('\\.'));
    var images=[];
    var feed = new Instafeed({
        get: 'user',
        userId: id,
        accessToken: token,
        //template: '<a href="{{link}}"><img src="{{image}}" /></a>',
        resolution: "standard_resolution",
        sortBy: 'most-recent',
        max_t: new Date(y,i),
        min_t: new Date(sy,si),
        limit: 50,
        mock: true,
        success: function(response) {
            if (debug){
                console.log('response of ', date, sdate);
            }
            images = images.concat(response.data)
            if (feed.hasNext()){
                feed.next();
            }else{
                feed._sortBy(images,'likes.count',false);
                build_pics(images)
            }
        },
        error: function(){
            console.log('no images');
        }

    });

// $('#next').click(function(){
//     feed.next();
// });
    feed.run();
}

function build_cal(data){
    if (debug){
        console.log('Length: '+data.length);
    }
    var images = data;
    var block = document.getElementById('instafeed');
    for (k = 0, len2 = images.length; k < len2; k++) {
//          console.log('here');
        var can = document.createElement('canvas');
        block.appendChild(can);
        add_pic(can,images[k],k+1);
        if (debug){
            $('#instafeed').append(('<br>Likes: '+images[k].likes.count));
            $('#instafeed').append('<br>Date: '+new Date(images[k].created_time*1000));
        }
    }
}

function build_pics(images){
    var block = document.getElementById('instafeed')
    var can = document.createElement('canvas')
    block.appendChild(can)
    add_pics_pics(can, images.slice(0,2))
}

function add_pics_pics(can, images){
    var ctx = can.getContext('2d');
    var url = 'JPG1/igtemplate.png';
    var back = new Image();
    back.src = url
    back.onload = function(){
        can.width = back.width
        can.height = back.height
        ctx.drawImage(back,0,0);
        var frts = []
        frts[0] = new Image()
        frts[1] = new Image()
        for (let i = 0 ; i < 2 ; i ++){
            var curImage = images[i]
            if (curImage!=null){
                imageUrl = curImage.images['standard_resolution'].url.replace('/s640x640','');
                if (drawtext){
                    text = curImage.caption.text;
                }
            }else{
                imageUrl ='';
            }
            if (debug){
                console.log('imageUrl: '+imageUrl);
            }
            let frt = frts[i]
            frt.src = imageUrl
            frt.onload = function(){
                if(debug){
                    console.log("Drawing frt_pic: ", i, frt.src)
                    console.log("Ctx", ctx)
                }
                if (frt.width > frt.height) {
                    ctx.drawImage(frt, can.width/2*(1-1300/1485)/2,can.width*(1300*(1-frt.height/frt.width)/2+200)/1485,can.width*1300/1485,can.width*1300*frt.height/frt.width/1485);
                }else if (frt.width < frt.height) {
                    ctx.drawImage(frt, can.width*(1485-1300+1300*(1-frt.width/frt.height))/1485/2,can.width*200/1485,can.width*1300*frt.width/frt.height/1485,can.width*1300/1485);
                }else{
                    if (debug){
                        console.log("Drawing Square pics")
                        console.log("Canvas Length and Width: ", can.width, can.height)
                        console.log("Params: ", can.width*( (1-(1600+12)/1812)/4 + (900+12)/1812*(i) ),can.width*100/1812 ,can.width*(800/1812),can.width*800/1812)
                    }
                    ctx.drawImage(frt, can.width*( (1-(1600+12)/1812)/4 + (900+12)/1812*(i) ),can.width*100/1812 ,can.width*(800/1812),can.width*800/1812);
                }
            }
        }
    }
}

function add_pic(can,curImage,i){
    var text;
    var back = new Image();
    var ctx = can.getContext('2d');
    var url = 'JPG1/Kalender-';
    // var curImage = image;
    if (i<10){
        url+='0';
        url+=i;
    }else{
        url+=i;
    }
    url+='\.png';
    back.src = url;
    back.onload = function(){
        if (debug){
            console.log(back.width,back.height);
        }
        can.width = back.width;
        can.height = back.height;
        ctx.drawImage(back,0,0);
        var frt = new Image();
        var imageUrl;
        if (curImage!==''){
            imageUrl = curImage.images['standard_resolution'].url.replace('/s640x640','');
            if (drawtext){
                text = curImage.caption.text;
            }
        }else{
            imageUrl ='';
        }
        if (debug){
            console.log('imageUrl: '+imageUrl);
        }
        frt.src = imageUrl;
        frt.onload = function(){
            // var oc = document.createElement('canvas');
            // octx = oc.getContext('2d');
            // oc.width = frt.width/2;
            // oc.height = frt.height/2;
            // octx.drawImage(frt,0,0,oc.width,oc.height);
            // octx.drawImage(oc,oc.width/2,oc.height/2);
            // console.log(i);
            //  console.log(frt.width,frt.height);
            if (frt.width > frt.height) {
                ctx.drawImage(frt, can.width*(1-1300/1485)/2,can.width*(1300*(1-frt.height/frt.width)/2+200)/1485,can.width*1300/1485,can.width*1300*frt.height/frt.width/1485);
            }else if (frt.width < frt.height) {
                ctx.drawImage(frt, can.width*(1485-1300+1300*(1-frt.width/frt.height))/1485/2,can.width*200/1485,can.width*1300*frt.width/frt.height/1485,can.width*1300/1485);
            }else{
                ctx.drawImage(frt, can.width*(1-1300/1485)/2,can.width*200/1485,can.width*1300/1485,can.width*1300/1485);
            }
            if (drawtext){
                ctx.save();
                ctx.fillStyle = "white";
                ctx.font = "50px 標楷體";
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                ctx.strokeText(text, can.width*(1-1300/1485)/2+20, can.width*1500/1485-20);
                ctx.fillText(text, can.width*(1-1300/1485)/2+20, can.width*1500/1485-20);

                ctx.restore();
            }
            // ctx.fill();
            // ctx.stroke();
        }
    }
}