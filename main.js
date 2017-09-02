//document.body.style = "background: black";
// var images=[];
debug = false;
drawtext = false;
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
        get_insta_by_month(images,2016,i);
    }
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
        max_t: new Date(2016,12),
        min_t: new Date(2015,11),
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

function get_insta_by_month(images,y,i){
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
            if (feed.hasNext()){
                feed.next();
            }
            images = images.concat(response.data);
            if (y===2016&&images.length<8){
                images = images.concat(response.data);
                get_insta_by_month(images,2015,i);
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

function build_cal(data){
    if (debug){
        console.log('Length: '+data.length);
    }
    var images = data;
    block = document.getElementById('instafeed');
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
            imagesUrl ='';
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