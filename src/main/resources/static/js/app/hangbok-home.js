let playerData = [];
let count = 0;

const main = {
    init : function(){
        // alert('main init 호출');
        $(window).on('load', function () {
            const flag = $('.fromDetail').attr("id");
            const userInput = $('.fromDetail').attr("value");;
            // console.log("flag : " + flag + " , userInput : " + userInput);
            if(flag=='Y') {
                _this.searchReal(userInput);

                event.preventDefault();

                $('html,body').animate({
                    scrollTop: $('.goto-here').offset().top
                }, 500, 'easeInOutExpo');
            }
        });

        const _this = this;
        $('#btn-search').on('click', function (event) {
            _this.search("");

            event.preventDefault();

            $('html,body').animate({
                scrollTop: $('.goto-here').offset().top
            }, 500, 'easeInOutExpo');

            return false;
        });

        $('#btn-search-tap').on('click', function (event) {
            _this.search("");

            event.preventDefault();

            $('html,body').animate({
                scrollTop: $('.goto-here').offset().top
            }, 500, 'easeInOutExpo');

            return false;
        });
        // 엔터키 눌렀을 때 search 메소드 호
        $(document).keypress(function (e) {
            if (e.which == 13) {
                // alert('enter key is pressed');
                _this.search("");

                e.preventDefault();

                $('html,body').animate({
                    scrollTop: $('.goto-here').offset().top
                }, 500, 'easeInOutExpo');

                return false;
            }
        });

        $('.navbar-nav .index-nav').addClass("active");

        const message = $(".message").val();
        // console.log(message);
        if(message != "") {
            alert(message);
        }

        drawBanHero();
    },
    search : function (userInput) {
        // alert('main search 호출');
        playerData = [];
        $("#search-result").remove();
        $(".notice_playerList").remove();
        $(".grid-header").remove();
        $(".more_btn_div").remove();
        $(".not-fount-base").remove();
        const noticeDiv = $('<div class="not-fount-base row"><div class="player not-found-player col-md-12">' +
            '검색한 플레이어의 프로필을 조회중입니다.<br>잠시만 기다려 주세요.</div></div>');
        $(".player-list-container").append(noticeDiv);

        let playerName = $('input[id="playerName"]').val();
        const playerName_tap = $('input[id="playerName-tap"]').val();

        if (playerName == "" && playerName_tap == "") {
            playerName = userInput;
        } else if (playerName == "" && playerName_tap != "") {
            playerName = playerName_tap;
        }
        // alert(playerName + " / "+ playerName.indexOf("#"));
        if (playerName.indexOf("#") != -1) {
            playerName = playerName.replace("#", "-");
        }
        if(playerName == "") {

        }else {
            // console.log(playerName);
            location.href = "/search/" + playerName;
        }
    },
    searchReal : function (userInput) {
        $(".player-list-container").empty();
        const noticeDiv = $('<div class="not-fount-base row"><div class="player not-found-player col-md-12">' +
            '검색한 플레이어의 프로필을 조회중입니다.<br>잠시만 기다려 주세요.</div></div>');
        $(".player-list-container").append(noticeDiv);
        playerName = userInput;

        const inputName = {
            playerName: playerName
        };
        // console.log("playerName : " + playerName);
        $.ajax({
            type: 'POST',
            url: '/showPlayerList',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(inputName),
            async : false
        }).done(function (datas) {
            // console.log("showPlayerList => " + datas);
            // console.log("/showPlayerList => 결과 내역 사이즈 : " + datas.length);
            count = datas.length;
            if(datas.length != 0) {
                $.each(datas, function (idx, data) {
                    playerData.push(data);
                });
                let player_list = $("#player_list").html();
                let template = Handlebars.compile(player_list);

                initPlayers(template);
            }else {
                $.ajax({
                    type: 'POST',
                    url: '/crawlingPlayerList',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(inputName),
                    async : false
                }).done(function (crawlingResult) {
                    // console.log("showUserList => " + crawlingResult);
                    // console.log("/showUserList => 결과 내역 사이즈 : " + crawlingResult.length);
                    if(crawlingResult.length == 0) {
                        $(".not-fount-base").remove();
                        const noticeDiv = $('<div class="not-fount-base row"><div class="player not-found-player col-md-12"> 옵치하기에 등록된 유저가 아닙니다.<br>' +
                            '옵치하기 최초 검색 시 배틀태그(플레이어명#00000)를 정확하게 입력해야 합니다.</div><div>');
                        //const testDiv = $('<div></div>');
                        $(".player-list-container").append(noticeDiv);
                    }else {
                        $.each(crawlingResult, function(i, player){
                            // console.log(player.battleTag, player.playerName);
                            location.href = "/showPlayerDetail/" + player.forUrl;
                        });
                    }
                });
            }
        });

        $('input[id="playerName"]').val("");
    }
};

function initPlayers(template) {
    $(".not-fount-base").remove();
    $(".more_btn_div").remove();
    var cnt = 15;
    if (playerData.length < 15) {
        cnt = playerData.length;
    }

    let item = {
        players: []
    };
    for (var i = 0 ; i < cnt ; i++) {
        var data = playerData[i];
        if(data.battleTag === 'message') {
            alert(data.playerName);
            return false;
        }
        const player = drawList(data);
        item.players.push(player);
    }

    const player_list = template(item);
    $('.player-list-container').append(player_list);
    $('.grid-header').text("총 "+ count +"건");

    if(cnt == 15) {
        const moreButtonDiv = $('<div class="more_btn_div" align="center">'
            + '<hr><a id="more_btn" href="javascript:morePlayers('+template+');">더보기(More)</a><hr>'
            + '</div>');
        $("#more-button").append(moreButtonDiv);
    }
    playerData.splice(0,cnt);
}

function morePlayers() {
    $(".more_btn_div").remove();
    var cnt = 15;
    if (playerData.length < 15) {
        cnt = playerData.length;
    }

    let item = {
        players: []
    };
    for (var i = 0 ; i < cnt ; i++) {
        var data = playerData[i];
        if(data.battleTag === 'message') {
            alert(data.playerName);
            return false;
        }
        const player = drawList(data);
        item.players.push(player);
    }

    let more_player_list = $("#more_player_list").html();
    let template = Handlebars.compile(more_player_list);
    const player_list = template(item);
    $('.tbody').append(player_list);

    if(cnt == 15) {
        const moreButtonDiv = $('<div class="more_btn_div" align="center">'
            + '<hr><a id="more_btn" href="javascript:morePlayers('+template+');">더보기(More)</a><hr>'
            + '</div>');
        $("#more-button").append(moreButtonDiv);
    }
    playerData.splice(0,cnt);
}

function playerDetail(obj) {
    // console.log($(obj).attr('attr-p'), $(obj).attr('attr-u'));
    const isPublic = $(obj).attr('attr-p');
    const forUrl = $(obj).attr('attr-u');
    location.href = "/showPlayerDetail/"+forUrl;
    // if(isPublic == 'Y') {
    //     location.href = "/showPlayerDetail/"+forUrl;
    // } else {
    //     alert("플레이어가 프로필을 비공개했습니다.\n" +
    //         "인게임에서 프로필 공개 이후 다시 검색해주세요.");
    //     return;
    // }
}

function drawList(data) {
    // return new Promise(function(data){})
    if(data.battleTag === 'message') {
        alert(data.playerName);
        return false;
    }
    // console.log(data.udtDtm);
    return {portrait: data.portrait, battleTag: data.battleTag, playerLevel: data.playerLevel, platform: data.platform, tankRatingPoint: data.tankRatingPoint, dealRatingPoint: data.dealRatingPoint, healRatingPoint: data.healRatingPoint, winRate: data.winRate,
    mostHero1: "/HWimages/hero/"+data.mostHero1+"_s.png", mostHero2: "/HWimages/hero/"+data.mostHero2+"_s.png", mostHero3: "/HWimages/hero/"+data.mostHero3+"_s.png", isPublic: data.isPublic, forUrl: data.forUrl, tankRatingImg: data.tankRatingImg,
    dealRatingImg: data.dealRatingImg, healRatingImg: data.healRatingImg, wingame: data.winGame, losegame: data.loseGame, udtDtm: data.udtDtm};
}

function drawBanHero() {
    // console.log("drawBanHero 호출");
    let items = {
        hero: []
    };

    $.ajax({
        type: 'POST',
        url: '/getBanHero',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        async : false
    }).done(function (datas) {
        // console.log(datas);
        if(datas.length != 0) {

            items.hero.push({
                heroNameTank: datas.heroName1,
                srcTank: "/HWimages/hero/" + datas.heroName1 + "_s.png",
                heroNameKRTank: datas.heroNameKR1,
                heroNameDeal1: datas.heroName2,
                srcDeal1: "/HWimages/hero/" + datas.heroName2 + "_s.png",
                heroNameKRDeal1: datas.heroNameKR2,
                heroNameDeal2: datas.heroName3,
                srcDeal2: "/HWimages/hero/" + datas.heroName3 + "_s.png",
                heroNameKRDeal2: datas.heroNameKR3,
                heroNameHeal: datas.heroName4,
                srcHeal: "/HWimages/hero/" + datas.heroName4 + "_s.png",
                heroNameKRHeal: datas.heroNameKR4,
                container1 : datas.heroRole1+"-container",
                container2 : datas.heroRole2+"-container",
                container3 : datas.heroRole3+"-container",
                container4 : datas.heroRole4+"-container",
                src1 : getSrc(datas.heroRole1),
                src2 : getSrc(datas.heroRole2),
                src3 : getSrc(datas.heroRole3),
                src4 : getSrc(datas.heroRole4),
            });
            let ban_list = $("#ban_hero_card").html();
            // console.log(ban_list);
            let template = Handlebars.compile(ban_list);

            const ban_hero_card = template(items);
            $('.ban-hero-list').append(ban_hero_card);
        }
    });
}

const getSrc = (role) => {
    if(role == "tank") {
        return "/HWimages/role/icon-tank-8a52daaf01.png";
    }else if (role == "deal") {
        return "/HWimages/role/icon-offense-6267addd52.png";
    }else if (role == "heal") {
        return "/HWimages/role/icon-support-46311a4210.png";
    }
};

main.init();
